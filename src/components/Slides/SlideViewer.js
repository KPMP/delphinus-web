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
		super(props);
		if (!this.props.selectedParticipant || this.props.selectedParticipant.id === "") {
			window.location.href = "/";
		}

		this.horizontalRef = React.createRef(500);
		this.verticalRef = React.createRef(500);
		this.handleShowGridToggle = this.handleShowGridToggle.bind(this)
		this.handleShowLabelToggle = this.handleShowLabelToggle.bind(this)
		this.handleCancelGridPropertiesClick = this.handleCancelGridPropertiesClick.bind(this);

		this.state = {
			showGrid: false,
			showGridLabel: false,
			overlayDivs: '',
			overlayLabel: [],
			renderLabels: true,
			gridOverlay: null
		}
	}

	async componentDidMount() {
		if (!noSlidesFound(this.props.selectedParticipant, this.props.handleError)) {
			await this.renderOverlayLabels();
			this.initSeaDragon();
		}
    
	}

	async componentDidUpdate(prevProps, prevState) {
		if (prevProps.selectedParticipant !== this.props.selectedParticipant) {
			this.viewer.destroy();
			this.viewer.navigator.destroy();
			noSlidesFound(this.props.selectedParticipant, this.props.handleError);
			await this.renderOverlayLabels();
			this.initSeaDragon();
		}
	}

	async renderOverlayLabels() {
    if(this.props.selectedParticipant.selectedSlide.slideType === "(LM) Light Microscopy"){
      await this.setState({
        overlayLabel: this.props.selectedParticipant.selectedSlide.metadata.overlayLabel,
        gridOverlay: this.props.selectedParticipant.selectedSlide.metadata.overlay,
        renderLabels: false,
        }
      )
    }
		await this.setState({renderLabels: true});
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
	}

	handleShowGridToggle() {
		if (this.state.showGrid) {
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

	handleCancelGridPropertiesClick(showGridLabel) {
		this.setState({ showGridLabel })
	}

	render() {
		return (
			<div>
				{(this.state.overlayLabel.length >= 1 && this.state.renderLabels) &&
					<DivOverlays showGridLabel={this.state.showGridLabel} overlayLabels={this.state.overlayLabel} />
				}
				<div id="slide-viewer" className="container-fluid">

					<Menu
						handleShowGridToggle={this.handleShowGridToggle}
						handleShowLabelToggle={this.handleShowLabelToggle}
						handleCancelGridPropertiesClick={this.handleCancelGridPropertiesClick}
						showGrid={this.state.showGrid}
						showGridLabel={this.state.showGridLabel}
						vertical='500'
						horizontal='500'
						horizontalRef={this.horizontalRef}
						verticalRef={this.verticalRef}
						selectedParticipant={this.props.selectedParticipant} 
            slideType={this.props.selectedParticipant.selectedSlide.slideType}/>

					<div className="osd-div" ref={node => { this.el = node; }}>
						<div className={`openseadragon ${(this.state.showGrid) ? 'showGridlines' : 'hideGridlines'}`} id="osdId"></div>
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
	handleError: PropTypes.func.isRequired
};

export default SlideViewer;