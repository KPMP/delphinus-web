import React, { Component } from 'react';
import OpenSeadragon from 'openseadragon';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus, faCrosshairs } from '@fortawesome/free-solid-svg-icons';
import { noSlidesFound } from './slideHelpers';
import Menu from './Menu/Menu';
import PropTypes from 'prop-types';
import DivOverlays from './DivOverlays';

class SlideViewer extends Component {
	constructor(props) {
		super(props)
		this.horizontalRef = React.createRef(500);
		this.verticalRef = React.createRef(500);
		this.handleShowGridToggle = this.handleShowGridToggle.bind(this)
		this.handleShowLabelToggle = this.handleShowLabelToggle.bind(this)
		this.handleSetGridPropertiesClick = this.handleSetGridPropertiesClick.bind(this)
		this.handleCancelGridPropertiesClick = this.handleCancelGridPropertiesClick.bind(this);

		this.state = {
			showGrid: true,
			showGridLabel: false,
			horizontal: 5000,
			vertical: 5000,
			overlayDivs: '',
			overlayLabels: []
		}
	}

	componentDidMount() {
		if (!noSlidesFound(this.props.selectedParticipant, this.props.handleError)) {
			this.initSeaDragon();
		}
	}

	componentDidUpdate(prevProps, prevState) {
		if (prevProps.selectedParticipant !== this.props.selectedParticipant || this.gridSizeChanged(prevState)) {
			this.viewer.destroy();
			this.viewer.navigator.destroy();
			this.initSeaDragon();
			noSlidesFound(this.props.selectedParticipant, this.props.handleError);
		}
	}
	gridSizeChanged(prevState) {
		if (prevState.horizontal !== this.state.horizontal ||
			prevState.vertical !== this.state.vertical) {
			return true;
		}
		return false;
	}

	gridStateChanged(prevState) {
		if (prevState.showGrid !== this.state.showGrid) {
			return true;
		}
		return false;
	}

	async getNextLetterInAlphabet(currentLetter = '') {

		if (!currentLetter || currentLetter === '') {
			return 'A'
		}
		let zerothLetter = currentLetter.split('')[0]

		const alphabet = {
			'A': 'B',
			'B': 'C',
			'C': 'D',
			'D': 'E',
			'E': 'F',
			'F': 'G',
			'G': 'H',
			'H': 'I',
			'I': 'J',
			'J': 'K',
			'K': 'L',
			'L': 'M',
			'M': 'N',
			'N': 'O',
			'O': 'P',
			'P': 'Q',
			'Q': 'R',
			'R': 'S',
			'S': 'T',
			'T': 'U',
			'U': 'V',
			'V': 'W',
			'W': 'X',
			'X': 'Y',
			'Y': 'Z',
			'Z': 'A',
		};

		let nextLetterLength = alphabet[zerothLetter] === 'A' ? currentLetter.length + 1 : currentLetter.length;
		let nextLetter = ''
		for (let i of new Array(nextLetterLength)) {  // eslint-disable-line
			nextLetter = nextLetter + alphabet[zerothLetter];
		}
		return nextLetter;
	}

	calculateGridLineLength(imageDimension, lineDimension) {
		// The choosen micron dimension may not be cleanly devisable by the image dimensions.
		// This function ensures the lines correctly line up during those cases.
		return (Math.ceil(((imageDimension + lineDimension) / lineDimension)) - 1) * lineDimension
	}
	async getGridOverlay(metadata) {
		// estimated micron unit
		let lineThickness = 10;
		let vertical = this.state.vertical;
		let horizontal = this.state.horizontal;

		let overlay = [];
		if (!this.state.showGrid) {
			return overlay
		}
		if (metadata && metadata.aperio && metadata.aperio.originalHeight && metadata.aperio.originalWidth) {

			let width = parseInt(metadata.aperio.originalWidth);
			let height = parseInt(metadata.aperio.originalHeight);
			for (let i = 0; i < (width + vertical); i += vertical) {
				overlay.push({
					px: i,
					py: 0,
					width: lineThickness,
					height: this.calculateGridLineLength(height, horizontal),
					className: 'gridline'
				})
			}

			for (let i = 0; i <= (height + horizontal); i += horizontal) {
				overlay.push({
					px: 0,
					py: i,
					width: this.calculateGridLineLength(width, vertical),
					height: lineThickness,
					className: 'gridline'
				})
			}
			let currentLetter = '';
			let overlayLabel = []
			for (let yy = 0; yy < (height); yy += vertical) {
				currentLetter = await this.getNextLetterInAlphabet('');
				for (let i = 0; i < (width); i += vertical) {

					overlayLabel.push(`${currentLetter + (yy / vertical)}`)
					overlay.push({
						id: `labelOverlay-${currentLetter + (yy / vertical)}`, px: 0 + (i / vertical * vertical + lineThickness), py: 0 + (yy / horizontal * horizontal + lineThickness),
					})
					currentLetter = await this.getNextLetterInAlphabet(currentLetter);
				}
			}

			this.setState(prevState => ({
				overlayLabels: overlayLabel
			}))

		} else {
			console.error('Metadata not provided with slide')
		}
		return overlay;
	}

	async initSeaDragon() {
		let slideId = this.props.selectedParticipant.selectedSlide.id;
		const gridOverlay = await this.getGridOverlay(this.props.selectedParticipant.selectedSlide.metadata);

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
			overlays: gridOverlay,
		});
	}

	handleShowGridToggle() {
		if (this.state.showGrid) {
			this.setState({ showGrid: false })
		} else {
			this.setState({ showGrid: true })
		}
	}

	handleShowLabelToggle() {
		if (this.state.showGridLabel) {
			this.setState({ showGridLabel: false })
		} else {
			this.setState({ showGridLabel: true })
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

				<DivOverlays showGridLabel={this.state.showGridLabel} overlayLabels={this.state.overlayLabels} />

				<div id="slide-viewer" className="container-fluid">

					<Menu
						handleShowGridToggle={this.handleShowGridToggle}
						handleShowLabelToggle={this.handleShowLabelToggle}
						handleCancelGridPropertiesClick={this.handleCancelGridPropertiesClick}
						showGrid={this.state.showGrid}
						showGridLabel={this.state.showGridLabel}
						handleSetGridPropertiesClick={this.handleSetGridPropertiesClick}
						vertical={this.state.vertical}
						horizontal={this.state.horizontal}
						horizontalRef={this.horizontalRef}
						verticalRef={this.verticalRef}
						selectedParticipant={this.props.selectedParticipant} />

					<div className="osd-div" ref={node => { this.el = node; }}>
						<div className={`openseadragon ${this.state.showGrid ? 'showGridlines' : 'hideGridlines'}`} id="osdId"></div>
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