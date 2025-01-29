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
			gridOverlay: null,
            metadataLoaded: false,
            loaded: false,
            currentSlideName: ''
		}
	}

	async componentDidMount() {
		await this.props.selectedParticipant.selectedSlide.slideType;
		
		if (!noSlidesFound(this.props.selectedParticipant, this.props.handleError)) {
			await this.renderOverlayLabels();
			this.initSeaDragon();
		}
		this.setState({ loaded: true });
	}

	async loadMetadata() {
        if (!this.state.metadataLoaded) {
            await this.props.getMetadataForSlide(this.props.selectedParticipant.id, this.props.selectedParticipant.selectedSlide.slideName);
            this.setState({ metadataLoaded: true, currentSlideName: this.props.selectedParticipant.selectedSlide.slideName });
        }
    }

	async componentDidUpdate(prevProps, prevState) {
		if (prevProps.selectedParticipant !== this.props.selectedParticipant ||
            prevProps.selectedParticipant.selectedSlide.slideName !== this.props.selectedParticipant.selectedSlide.slideName) {
			this.viewer.destroy();
			this.viewer.navigator.destroy();
			noSlidesFound(this.props.selectedParticipant, this.props.handleError);
			await this.renderOverlayLabels();
			this.initSeaDragon();
		}
	}

	async renderOverlayLabels() {
		if(this.props.selectedParticipant.selectedSlide.slideType === "(LM) Light Microscopy" &&
			!(this.props.selectedParticipant.selectedSlide?.removed === true)){
                if (!this.state.metadataLoaded || this.props.selectedParticipant.selectedSlide.slideName !== this.state.currentSlideName) {
                    await this.props.setSlideMetadata(this.props.selectedParticipant.id, this.props.selectedParticipant.selectedSlide.slideName);
                    this.setState({ metadataLoaded: true, currentSlideName: this.props.selectedParticipant.selectedSlide.slideName });
                }
                
			if (this.props.selectedParticipant.selectedMetadata) {
				await this.setState({
					renderLabels: false,
				});
				await this.setState({ renderLabels: true });
			}
		}
		else {
			await this.setState({
				overlayLabel: [],
				gridOverlay: null,
				renderLabels: false,
			})
		}
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
                {console.log(this.props)}

				{this.state.metadataLoaded && this.props.selectedParticipant.selectedMetadata?.overlayLabel?.length >= 1 && this.state.renderLabels &&
                <DivOverlays showGridLabel={this.state.showGridLabel} overlayLabels={this.props.selectedParticipant.selectedMetadata.overlayLabel} />}
				<div id="slide-viewer" className="container-fluid">
        
        {
          this.state.loaded ? 
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
						selectedParticipant={this.props.selectedParticipant}/>
            :
            null
        }
					

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