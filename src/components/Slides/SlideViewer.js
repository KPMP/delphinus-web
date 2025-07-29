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

    // Refs for OSD containers
    this.viewerContainerRef = React.createRef();
    this.navigatorRef = React.createRef();

    this.handleShowGridToggle = this.handleShowGridToggle.bind(this);
    this.handleShowLabelToggle = this.handleShowLabelToggle.bind(this);
    this.handleCancelGridPropertiesClick = this.handleCancelGridPropertiesClick.bind(this);

    this.state = {
      showGrid: false,
      showGridLabel: false,
      overlayDivs: '',
      overlayLabel: [],
      renderLabels: true,
      gridOverlay: null,
      loaded: false,
    };
  }

  async componentDidMount() {
    console.log('[SlideViewer] componentDidMount - initializing viewer');
    await this.props.selectedParticipant.selectedSlide.slideType;

    if (!noSlidesFound(this.props.selectedParticipant, this.props.handleError)) {
      await this.renderOverlayLabels();
      this.initSeaDragon();
    }

    this.setState({ loaded: true });
  }

  async componentDidUpdate(prevProps) {
    if (prevProps.selectedParticipant !== this.props.selectedParticipant) {
      console.log('[SlideViewer] componentDidUpdate - new participant detected');

      // Destroy old viewer (do NOT clear DOM, keeps navigator intact)
      if (this.viewer) {
        console.log('[SlideViewer] Destroying previous viewer');
        this.viewer.destroy();
        this.viewer = null;
      }

      noSlidesFound(this.props.selectedParticipant, this.props.handleError);
      await this.renderOverlayLabels();

      // Initialize after DOM updates
      console.log('[SlideViewer] Scheduling new viewer initialization (setTimeout)');
      setTimeout(() => {
        this.initSeaDragon();
      }, 0);
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
    console.log('[SlideViewer] initSeaDragon called');
    const slideId = this.props.selectedParticipant.selectedSlide.id;
    const container = this.viewerContainerRef.current;

    if (!container) {
      console.error('[SlideViewer] initSeaDragon - viewer container ref is null');
      return;
    }

    const navigatorContainer = this.navigatorRef.current;
    if (!navigatorContainer) {
      console.error('[SlideViewer] initSeaDragon - navigator ref is null; retrying in 50ms');
      setTimeout(() => this.initSeaDragon(), 50);
      return;
    }

    console.log('[SlideViewer] Initializing OpenSeadragon with slideId:', slideId);

    OpenSeadragon.setString("Tooltips.Home", "Reset pan & zoom");

    // Initialize viewer without auto navigator
    this.viewer = OpenSeadragon({
      element: container,
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
      showNavigator: false, // disable built-in navigator
      tileSources: 'deepZoomImages/' + slideId + '.dzi',
      overlays: this.state.gridOverlay
    });

    // Attach manual navigator after viewer is ready
    this.viewer.addHandler('open', () => {
      console.log('[SlideViewer] Viewer open - creating manual navigator');

      const navElem = this.navigatorRef.current;
      if (!navElem) {
        console.error('[SlideViewer] Navigator ref still null during open; retrying in 50ms');
        setTimeout(() => this.initSeaDragon(), 50);
        return;
      }

      new OpenSeadragon.Navigator({
        viewer: this.viewer,
        element: navElem,
        autoFade: false,
      });
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
            <div
              ref={this.viewerContainerRef}
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
              {/* Navigator always present */}
              <div ref={this.navigatorRef}></div>
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
