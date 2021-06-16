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
		this.state = { gridOverlay: this.getGridOverlay(this.props.selectedParticipant.selectedSlide.metadata), viewer: '' }
	}

	componentDidMount() {
		if (!noSlidesFound(this.props.selectedParticipant, this.props.handleError)) {
			this.initSeaDragon();
		}
	}

	componentDidUpdate() {
		this.viewer.destroy();
		this.viewer.navigator.destroy();
		this.initSeaDragon();
		noSlidesFound(this.props.selectedParticipant, this.props.handleError);
	}

	getGridOverlay(metadata) {
		// estimated micron unit
		let microns = 500;
		let lineThickness = 10;


		let overlay = []
		if (metadata && metadata.aperio && metadata.aperio.originalHeight && metadata.aperio.originalWidth) {

			let width = parseInt(metadata.aperio.originalWidth);
			let height = parseInt(metadata.aperio.originalHeight);

			for (let i = 0; i < (width + microns); i += microns) {
				overlay.push({
					px: i,
					py: 0,
					width: lineThickness,
					height: height + microns,
					className: 'gridline'
				})
			}

			for (let i = 0; i <= (height + microns); i += microns) {
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
			overlays: this.state.gridOverlay
		});
		this.setState({ viewer: this.viewer });
	}


	render() {
		return (
			<div id="slide-viewer" className="container-fluid">
				<Menu selectedParticipant={this.props.selectedParticipant} />
				<div id="osdOverlay">

				</div>
				<hr />
				<div className="osd-div" ref={node => { this.el = node; }}>
					<div className="openseadragon" id="osdId"></div>
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