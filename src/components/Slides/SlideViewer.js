import React, { Component } from 'react';
import OpenSeadragon from 'openseadragon';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus, faCrosshairs } from '@fortawesome/free-solid-svg-icons';
import { noSlidesFound, determineIfSlideTooLargeForGrid, determineIfPilotSlide, getNextLetterInAlphabet } from './slideHelpers';
import Menu from './Menu/Menu';
import PropTypes from 'prop-types';
import DivOverlays from './DivOverlays';

class SlideViewer extends Component {
	constructor(props) {
		super(props);
		let vertical = 500;
		this.horizontalRef = React.createRef(500);
		this.verticalRef = React.createRef(500);
		this.handleShowGridToggle = this.handleShowGridToggle.bind(this)
		this.handleShowLabelToggle = this.handleShowLabelToggle.bind(this)
		this.handleSetGridPropertiesClick = this.handleSetGridPropertiesClick.bind(this)
		this.handleCancelGridPropertiesClick = this.handleCancelGridPropertiesClick.bind(this);
	

		this.state = {
			showGrid: false,
			showGridLabel: false,
			horizontal: 500,
			vertical: vertical,
			overlayDivs: '',
			overlayLabel: [],
			renderLabels: true,
			labelSetId: 0,
			slideTooLarge: false,
			isPilotSlide: false,
		}
	}

	async componentDidMount() {
		await this.renderOverlayLabels();
		if (!noSlidesFound(this.props.selectedParticipant, this.props.handleError)) {
			this.initSeaDragon();
		}
	}

	async componentDidUpdate(prevProps, prevState) {
		if (
			prevProps.selectedParticipant !== this.props.selectedParticipant
				|| this.gridSizeChanged(prevState)) {
			this.viewer.destroy();
			this.viewer.navigator.destroy();
			await this.renderOverlayLabels();
			this.initSeaDragon();
			noSlidesFound(this.props.selectedParticipant, this.props.handleError);
		}
	}

	gridSizeChanged(prevState) {
		if (prevState.horizontal !== this.state.horizontal 
			|| prevState.vertical !== this.state.vertical) {
			return true;
		}
		return false;
	}


	async renderOverlayLabels() {
		this.setState({slideTooLarge: determineIfSlideTooLargeForGrid(this.props.selectedParticipant.selectedSlide.metadata, this.state.vertical),
			isPiolotSlide: determineIfPilotSlide(this.props.participants, this.props.selectedParticipant)});
		if (!this.state.isPilotSlide && !this.state.slideTooLarge ) {
			const [gridOverlay, overlayLabel] = await this.getGridOverlay( // eslint-disable-line
				this.props.selectedParticipant.selectedSlide.metadata,
				this.state.labelSetId + 1);
			await this.setState({ overlayLabel, renderLabels: false, labelSetId: this.state.labelSetId + 1 })
			await this.setState({ renderLabels: true })
		} 
	}

	getNextLetterInAlphabet(currentLetter = '') {
		return getNextLetterInAlphabet(currentLetter);
	}

	async getGridOverlay(metadata, labelSetId) {
		let lineThickness = 13;
		let vertical = this.state.vertical / parseFloat(this.props.selectedParticipant.selectedSlide.metadata.openSlide.mpp_y);
		let horizontal = this.state.horizontal / parseFloat(this.props.selectedParticipant.selectedSlide.metadata.openSlide.mpp_x);
		let overlay = [];
		let overlayLabel = [];
		if (metadata && metadata.aperio && metadata.aperio.originalHeight && metadata.aperio.originalWidth) {
			let width = parseInt(metadata.aperio.originalWidth);
			let height = parseInt(metadata.aperio.originalHeight);

			let gridLineLengthForHeight = (Math.ceil(((height + horizontal) / horizontal)) -1 ) * horizontal;
            let gridLineLengthForWidth = (Math.ceil(((width + horizontal) / horizontal)) -1 ) * horizontal;

			for (let i = 0; i < (width + vertical); i += vertical) {
				overlay.push({
					px: i,
					py: 0,
					width: lineThickness,
					height: gridLineLengthForHeight,
					className: 'gridline'
				})
			}

			let currentLetter = '';
			let currentNumber = 0;
			let verticalOffset = vertical * vertical + lineThickness;
			let horizontalOffset = horizontal * horizontal + lineThickness;

			for (let i = 0; i <= (height + horizontal); i += horizontal) {
				overlay.push({
					px: 0,
					py: i,
					width: gridLineLengthForWidth,
					height: lineThickness,
					className: 'gridline'
				})
				for (let i = 0; i < (width); i += vertical) {
					overlayLabel.push(`${currentLetter + currentNumber}`)
					overlay.push({
						id: `labelOverlay-${currentLetter + currentNumber}-${labelSetId}`,
						px: 0 + (i / verticalOffset),
						py: 0 + (yy / horizontalOffset),
					})
					currentLetter = this.getNextLetterInAlphabet(currentLetter);
				}
				currentNumber += 1;
			}
			
			// let currentLetter = '';
			// let currentNumber = 0;
			// let verticalOffset = vertical * vertical + lineThickness;
			// let horizontalOffset = horizontal * horizontal + lineThickness;
			
			// for (let yy = 0; yy < (height); yy += horizontal) {
			// 	currentLetter = this.getNextLetterInAlphabet('');
			// 	for (let i = 0; i < (width); i += vertical) {
			// 		overlayLabel.push(`${currentLetter + currentNumber}`)
			// 		overlay.push({
			// 			id: `labelOverlay-${currentLetter + currentNumber}-${labelSetId}`,
			// 			px: 0 + (i / verticalOffset),
			// 			py: 0 + (yy / horizontalOffset),
			// 		})
			// 		currentLetter = this.getNextLetterInAlphabet(currentLetter);
			// 	}
			// 	currentNumber += 1;
			// }

		} else {
			console.error('Metadata not provided with slide');
		}
		return [overlay, overlayLabel];
	}

	async initSeaDragon() {
		let slideId = this.props.selectedParticipant.selectedSlide.id;
		let overlayGrid = []
		if (!this.state.slideTooLarge || !this.state.isPilotSlide) {
			let [gridOverlay] = await this.getGridOverlay(this.props.selectedParticipant.selectedSlide.metadata, this.state.labelSetId);
			overlayGrid = gridOverlay
		}
		OpenSeadragon.setString("Tooltips.Home", "Reset pan & zoom");
		this.viewer = OpenSeadragon({
			id: "osdId",
			visibilityRatio: 0.5,
			constrainDuringPan: false,
			defaultZoomLevel: 1,
			minZoomLevel: 0.5,
			maxZoomLevel: 120,
			zoomInButton: 'zoom-in',
			zoomOutButton: 'zoom-out',
			homeButton: 'reset',
			fullPageButton: 'full-page',
			nextButton: 'next',
			previousButton: 'previous',
			showNavigator: true,
			navigatorAutoFade: false,
			navigatorId: 'osd-navigator',
			tileSources: 'deepZoomImages/' + slideId + '.dzi',
			overlays: overlayGrid
		});
	}

	handleShowGridToggle() {
		console.log('handle show grid toggle');
		if (this.state.showGrid || this.state.slideTooLarge || this.state.isPilotSlide) {
			this.setState({ showGrid: false, showGridLabel: false })
		} else {
			this.setState({ showGrid: true })
		}
	}

	handleShowLabelToggle() {
		if (this.state.showGridLabel) {
			this.setState({ showGridLabel: false })
		} else {
			this.setState({ showGrid: true, showGridLabel: true })
		}
	}

	handleSetGridPropertiesClick() {
		this.setState({
			horizontal: parseInt(this.horizontalRef.current.value),
			vertical: parseInt(this.verticalRef.current.value)
		})
	}
	handleCancelGridPropertiesClick(showGridLabel) {
		this.setState({ showGridLabel })
	}

	render() {
		return (
			<div>
				{(this.state.overlayLabel.length >= 1 && this.state.renderLabels) &&
					<DivOverlays showGridLabel={this.state.showGridLabel} labelSetId={this.state.labelSetId} overlayLabels={this.state.overlayLabel} />
				}

				<div id="slide-viewer" className="container-fluid">

					<Menu
						handleShowGridToggle={this.handleShowGridToggle}
						handleShowLabelToggle={this.handleShowLabelToggle}
						handleCancelGridPropertiesClick={this.handleCancelGridPropertiesClick}
						showGrid={this.state.showGrid}
						showGridLabel={this.state.showGridLabel}
						slideTooLarge={this.state.slideTooLarge}
						isPilotSlide={this.state.isPilotSlide}
						handleSetGridPropertiesClick={this.handleSetGridPropertiesClick}
						vertical={this.state.vertical}
						horizontal={this.state.horizontal}
						horizontalRef={this.horizontalRef}
						verticalRef={this.verticalRef}
						selectedParticipant={this.props.selectedParticipant} />

					<div className="osd-div" ref={node => { this.el = node; }}>
						<div className={`openseadragon ${(this.state.showGrid && !this.state.slideTooLarge && !this.state.isPilotSlide) ? 'showGridlines' : 'hideGridlines'}`} id="osdId"></div>
						<ul className="osd-toolbar">
							<li><div className="osd-button" id="zoom-in"><FontAwesomeIcon icon={faPlus} /></div></li>
							<li><div className="osd-button" id="zoom-out"><FontAwesomeIcon icon={faMinus} /></div></li>
							<li><div className="osd-button" id="reset"><FontAwesomeIcon icon={faCrosshairs} /></div></li>
						</ul>
						<div className="osd-navigator-wrapper">
							<div id="osd-navigator"></div>
						</div>
					</div>
				</div>
			</div>
		)
	}
}

SlideViewer.propTypes = {
	selectedParticipant: PropTypes.object.isRequired,
};

export default SlideViewer;