import React, { Component } from 'react';
import OpenSeadragon from 'openseadragon';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus, faCrosshairs } from '@fortawesome/free-solid-svg-icons';
import { noSlidesFound } from './slideHelpers';
import Menu from './Menu/Menu';
import PropTypes from 'prop-types';

class SlideViewer extends Component {

	initSeaDragon() {
		let self = this;
		let slideId = this.props.selectedParticipant.selectedSlide.id;
		OpenSeadragon.setString("Tooltips.Home","Reset pan & zoom");
		self.viewer =  OpenSeadragon({
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
			navigatorAutoFade:  false,
			navigatorId:   'osd-navigator',
			tileSources: 'deepZoomImages/' + slideId + '.dzi'
		});
	}

	componentDidMount(){
		if(!noSlidesFound(this.props.selectedParticipant, this.props.handleError)) {
            this.initSeaDragon();
		}
		document.body.classList.add('slide-viewer-body');
	}

	componentDidUpdate(){
		this.viewer.destroy();
		this.viewer.navigator.destroy();
		this.initSeaDragon();
		noSlidesFound(this.props.selectedParticipant, this.props.handleError);
	}

	render() {
		return (
			<div id="slide-viewer">
				<Menu selectedParticipant={this.props.selectedParticipant}/>
				<div className="osd-div" ref={node => {this.el = node;}}>
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