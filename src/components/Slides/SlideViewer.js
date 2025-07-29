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

    // Ref for OpenSeadragon container
    this.viewerContainerRef = React.createRef();

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

      // Destroy old viewer
      if (this.viewer) {
        console.log('[SlideViewer] Destroying previous viewer');
        this.viewer.destroy();
        this.viewer = null;
      }

      // Clear container
      if (this.viewerContainerRef.current) {
        console.log('[SlideViewer] Clearing viewer container innerHTML');
        this.viewerContainerRef.current.innerHTML = '';
      } else {
        console.warn('[SlideViewer] viewerContainerRef is null!');
      }

      noSlidesFound(this.props.selectedParticipant, this.props.handleError);
      await this.renderOverlayLabels();

      // Defer init with setTimeout to ensure both refs are mounted
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
    const navigatorContainer = this.navigatorRef.current;

    if (!container) {
      console.error('[SlideViewer] initSeaDragon - viewer container ref is null');
      return;
    }

    if (!navigatorContainer) {
      console.error('[SlideViewer] initSeaDragon - navigator ref is null; retrying in 50ms');
      // Retry shortly if navigator not yet mounted
      setTimeout(() => this.initSeaDragon(), 50);
      return;
    }

    console.log('[SlideViewer] Initializing OpenSeadragon with slideId:', slideId);

    OpenSeadragon.setString("Tooltips.Home", "Reset pan & zoom");

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
      showNavigator: true,
      navigatorAutoFade: false,
      navigatorElement: navigatorContainer, // pass ref directly
      tileSources: 'deepZoomImages/' + slideId + '.dzi',
      overlays: this.state.gridOverlay
    });

    this.viewer.addHandler('open', () => {
      console.log('[SlideViewer] OpenSeadragon viewer opened successfully for slideId:', slideId);
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
              <div id="osd-navigator"></div>
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
