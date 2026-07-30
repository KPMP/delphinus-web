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
      loaded: false,
		}

		this.activeMetadataRequestKey = null;
		this.metadataAbortController = null;
	}

	async componentDidMount() {
		if (noSlidesFound(this.props.selectedParticipant, this.props.handleError)) {
			this.setState({ loaded: true });
			return;
		}

		await this.props.selectedParticipant.selectedSlide.slideType;
		if (!noSlidesFound(this.props.selectedParticipant, this.props.handleError)) {
			await this.renderOverlayLabels();
			this.initSeaDragon();
		}
		this.setState({ loaded: true });
	}

	async componentDidUpdate(prevProps, prevState) {
		const slideChanged = prevProps.selectedParticipant?.id !== this.props.selectedParticipant?.id ||
			prevProps.selectedParticipant?.selectedSlide?.id !== this.props.selectedParticipant?.selectedSlide?.id;
		const showGridChanged = prevState.showGrid !== this.state.showGrid;

		if (slideChanged || showGridChanged) {
			if (this.viewer) {
				this.viewer.destroy();
				this.viewer.navigator?.destroy();
			}
			if (noSlidesFound(this.props.selectedParticipant, this.props.handleError)) {
				return;
			}
			await this.renderOverlayLabels();
			this.initSeaDragon();
		}
	}

	shouldLoadOverlayMetadata() {
		return this.state.showGrid &&
			this.props.selectedParticipant?.selectedSlide?.slideType === "(LM) Light Microscopy" &&
			!(this.props.selectedParticipant?.selectedSlide?.removed === true);
	}

	getMetadataRequestKey(participantId, slideName) {
		return `${participantId}/${slideName}`;
	}

	isCurrentMetadataRequest(requestKey, participantId, slideName) {
		return this.activeMetadataRequestKey === this.getMetadataRequestKey(participantId, slideName) && requestKey === this.getMetadataRequestKey(participantId, slideName);
	}

	cancelPendingMetadataRequest() {
		if (this.metadataAbortController) {
			this.metadataAbortController.abort();
		}
		this.metadataAbortController = null;
	}

	async renderOverlayLabels() {
		const shouldRenderOverlays = this.shouldLoadOverlayMetadata();

		if (!shouldRenderOverlays) {
			this.cancelPendingMetadataRequest();
			await this.setState({
				overlayLabel: [],
				gridOverlay: null,
				renderLabels: false,
			});
			return;
		}

		const participantId = this.props.selectedParticipant.id;
		const slideName = this.props.selectedParticipant.selectedSlide.slideName;
		const requestKey = this.getMetadataRequestKey(participantId, slideName);
		this.cancelPendingMetadataRequest();
		this.metadataAbortController = new AbortController();
		this.activeMetadataRequestKey = requestKey;

		const metadata = await this.props.getSelectedMetadata(
			participantId,
			slideName,
			{ signal: this.metadataAbortController.signal }
		);

		if (!this.isCurrentMetadataRequest(requestKey, participantId, slideName)) {
			this.metadataAbortController = null;
			return;
		}

		this.metadataAbortController = null;
		await this.setState({
			overlayLabel: metadata?.overlayLabel || [],
			gridOverlay: metadata?.overlay || null,
			renderLabels: false,
		});
		await this.setState({ renderLabels: true });
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
		const nextShowGrid = !this.state.showGrid;
		this.setState({ showGrid: nextShowGrid, showGridLabel: false }, async () => {
			if (nextShowGrid) {
				await this.renderOverlayLabels();
			} else {
				this.cancelPendingMetadataRequest();
				await this.setState({
					overlayLabel: [],
					gridOverlay: null,
					renderLabels: false,
				});
			}
		});
	}

	handleShowLabelToggle() {
		const nextShowGridLabel = !this.state.showGridLabel;
		this.setState({ showGridLabel: nextShowGridLabel, showGrid: nextShowGridLabel }, async () => {
			if (nextShowGridLabel) {
				await this.renderOverlayLabels();
			} else {
				this.cancelPendingMetadataRequest();
				await this.setState({
					overlayLabel: [],
					gridOverlay: null,
					renderLabels: false,
				});
			}
		});
	}

	handleCancelGridPropertiesClick(showGridLabel) {
		this.setState({ showGridLabel })
	}

	render() {
		return (
			<div>
				{(this.state.showGrid && this.state.overlayLabel.length >= 1 && this.state.renderLabels) &&
					<DivOverlays showGridLabel={this.state.showGridLabel} overlayLabels={this.state.overlayLabel} />
				}
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