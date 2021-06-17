import React, { Component } from 'react';
import OpenSeadragon from 'openseadragon';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus, faCrosshairs } from '@fortawesome/free-solid-svg-icons';
import { noSlidesFound } from './slideHelpers';
import Menu from './Menu/Menu';
import PropTypes from 'prop-types';

class SlideViewer extends Component {
	constructor(props) {
		super(props)
		this.horizontalRef = React.createRef(500);
		this.verticalRef = React.createRef(500);
		this.handleShowGridToggle = this.handleShowGridToggle.bind(this)
		this.handleSetGridPropertiesClick = this.handleSetGridPropertiesClick.bind(this)

		this.state = {
			showGrid: true,
			horizontal: 500,
			vertical: 500,
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

	getGridOverlay(metadata) {
		// estimated micron unit
		let lineThickness = 10;
		let vertical = this.state.vertical;
		let horizontal = this.state.horizontal;

		let overlay = []
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
					height: height + vertical,
					className: 'gridline'
				})
			}

			for (let i = 0; i <= (height + horizontal); i += horizontal) {
				overlay.push({
					px: 0,
					py: i,
					width: width,
					height: lineThickness,
					className: 'gridline'
				})
			}
		} else {
			console.error('Metadata not provided with slide')
		}
		return overlay;
	}

	initSeaDragon() {
		let slideId = this.props.selectedParticipant.selectedSlide.id;
		const gridOverlay = this.getGridOverlay(this.props.selectedParticipant.selectedSlide.metadata);

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
			overlays: gridOverlay
		});
	}

	handleShowGridToggle() {
		if (this.state.showGrid) {
			this.setState({ showGrid: false })
		} else {
			this.setState({ showGrid: true })
		}
	}

	handleSetGridPropertiesClick() {
		this.setState({
			horizontal: parseInt(this.horizontalRef.current.value),
			vertical: parseInt(this.verticalRef.current.value)
		})
	}

	render() {
		return (
			<div id="slide-viewer" className="container-fluid">
				<Menu
					handleShowGridToggle={this.handleShowGridToggle}
					showGrid={this.state.showGrid}
					handleSetGridPropertiesClick={this.handleSetGridPropertiesClick}
					vertical={this.state.vertical}
					horizontal={this.state.horizontal}
					horizontalRef={this.horizontalRef}
					verticalRef={this.verticalRef}
					selectedParticipant={this.props.selectedParticipant} />
				<div id="osdOverlay">

				</div>
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
		)
	}
}

SlideViewer.propTypes = {
	selectedParticipant: PropTypes.object.isRequired,
};

export default SlideViewer;