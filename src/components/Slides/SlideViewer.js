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

    this.horizontalRef = React.createRef();
    this.verticalRef = React.createRef();

    this.navigatorRef = React.createRef();

    // We'll hold the viewer container node here manually via callback ref
    this.viewerContainerRef = null;

    this.state = {
      showGrid: false,
      showGridLabel: false,
      overlayDivs: '',
      overlayLabel: [],
      renderLabels: true,
      gridOverlay: null,
      loaded: false,
      readyToInit: false, // Flag to coordinate initSeaDragon timing
    };

    this.handleShowGridToggle = this.handleShowGridToggle.bind(this);
    this.handleShowLabelToggle = this.handleShowLabelToggle.bind(this);
    this.handleCancelGridPropertiesClick = this.handleCancelGridPropertiesClick.bind(this);
    this.onViewerContainerRef = this.onViewerContainerRef.bind(this);
  }

  componentDidMount() {
    console.log('[SlideViewer] componentDidMount - initializing viewer');
    if (!noSlidesFound(this.props.selectedParticipant, this.props.handleError)) {
      this.renderOverlayLabels().then(() => {
        // Set flag to init after initial mount
        this.setState({ readyToInit: true, loaded: true });
      });
    } else {
      this.setState({ loaded: true });
    }
  }

  async componentDidUpdate(prevProps) {
    if (prevProps.selectedParticipant !== this.props.selectedParticipant) {
      console.log('[SlideViewer] componentDidUpdate - new participant detected');

      if (this.viewer) {
        console.log('[SlideViewer] Destroying previous viewer');
        this.viewer.destroy();
        this.viewer = null;
      }

      await this.renderOverlayLabels();

      // Signal that we want to initialize viewer once container remounts
      this.setState({ readyToInit: true });
    }
  }

  onViewerContainerRef(node) {
    this.viewerContainerRef = node;

    // If container is mounted AND ready flag is set, init viewer
    if (node && this.state.readyToInit) {
      console.log('[SlideViewer] Viewer container mounted and ready, initializing viewer');
      this.initSeaDragon();
      this.setState({ readyToInit: false }); // reset flag to avoid re-init
    }
  }

  async renderOverlayLabels() {
    console.log('[SlideViewer] Rendering overlay labels');
    if (
      this.props.selectedParticipant.selectedSlide.slideType === "(LM) Light Microscopy" &&
      !(this.props.selectedParticipant.selectedSlide?.removed === true)
    ) {
      await this.setState({
        overlayLabel: this.props.selectedParticipant.selectedSlide.metadata.overlayLabel,
        gridOverlay: this.props.selectedParticipant.selectedSlide.metadata.overlay,
        renderLabels: false,
      });
      await this.setState({ renderLabels: true });
    } else {
      await this.setState({
        overlayLabel: [],
        gridOverlay: null,
        renderLabels: false,
      });
    }
  }

  initSeaDragon() {
    const slideId = this.props.selectedParticipant.selectedSlide.id;
    const container = this.viewerContainerRef;
    const navigatorContainer = this.navigatorRef.current;

    if (!container || !navigatorContainer) {
      console.warn('[SlideViewer] initSeaDragon - container or navigator ref missing, retrying in 50ms');
      setTimeout(() => this.initSeaDragon(), 50);
      return;
    }

    console.log('[SlideViewer] Initializing OpenSeadragon with slideId:', slideId);
    console.log('[SlideViewer] Container dimensions:', container.offsetWidth, container.offsetHeight);

    OpenSeadragon.setString("Tooltips.Home", "Reset pan & zoom");

    this.viewer = OpenSeadragon({
      element: container,
      visibilityRatio: 0.5,
      constrainDuringPan: false,
      showNavigator: true,
      navigatorElement: navigatorContainer,
      navigatorAutoFade: false,
      tileSources: 'deepZoomImages/' + slideId + '.dzi',
      overlays: this.state.gridOverlay,
    });

    this.viewer.addHandler('open', () => {
      console.log('[SlideViewer] Viewer opened for slideId:', slideId);
      this.viewer.viewport.goHome(true); // Ensure proper zoom and pan reset
    });

    this.viewer.addHandler('tile-load-failed', (event) => {
      console.error('[SlideViewer] Tile failed to load:', event);
    });
  }

  handleShowGridToggle() {
    this.setState(prev => ({
      showGrid: !prev.showGrid,
      showGridLabel: prev.showGrid ? false : prev.showGridLabel,
    }));
  }

  handleShowLabelToggle() {
    this.setState(prev => ({
      showGrid: true,
      showGridLabel: !prev.showGridLabel,
    }));
  }

  handleCancelGridPropertiesClick(showGridLabel) {
    this.setState({ showGridLabel });
  }

  render() {
    return (
      <div>
        {(this.state.overlayLabel.length >= 1 && this.state.renderLabels) && (
          <DivOverlays
            showGridLabel={this.state.showGridLabel}
            overlayLabels={this.state.overlayLabel}
          />
        )}

        <div id="slide-viewer" className="container-fluid">
          {this.state.loaded ? (
            <Menu
              handleShowGridToggle={this.handleShowGridToggle}
              handleShowLabelToggle={this.handleShowLabelToggle}
              handleCancelGridPropertiesClick={this.handleCancelGridPropertiesClick}
              showGrid={this.state.showGrid}
              showGridLabel={this.state.showGridLabel}
              vertical="500"
              horizontal="500"
              horizontalRef={this.horizontalRef}
              verticalRef={this.verticalRef}
              selectedParticipant={this.props.selectedParticipant}
            />
          ) : null}

          <div className="osd-div">
            {/* key to force remount on slide change */}
            <div
              key={this.props.selectedParticipant.selectedSlide.id}
              ref={this.onViewerContainerRef}
              className={`openseadragon ${this.state.showGrid ? 'showGridlines' : 'hideGridlines'}`}
              id="osdId"
            ></div>

            <ul className="osd-toolbar">
              <li>
                <div className="osd-button" id="zoom-in">
                  <FontAwesomeIcon icon={faPlus} />
                </div>
              </li>
              <li>
                <div className="osd-button" id="zoom-out">
                  <FontAwesomeIcon icon={faMinus} />
                </div>
              </li>
              <li>
                <div className="osd-button" id="reset">
                  <FontAwesomeIcon icon={faCrosshairs} />
                </div>
              </li>
            </ul>

            <div className="osd-navigator-wrapper">
              <div id="osd-navigator" ref={this.navigatorRef}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

SlideViewer.propTypes = {
  selectedParticipant: PropTypes.object.isRequired,
  handleError: PropTypes.func.isRequired,
};

export default SlideViewer;
