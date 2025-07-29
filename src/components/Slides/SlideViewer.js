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

    if (!props.selectedParticipant || props.selectedParticipant.id === "") {
      window.location.href = "/";
    }

    this.horizontalRef = React.createRef(500);
    this.verticalRef = React.createRef(500);

    this.handleShowGridToggle = this.handleShowGridToggle.bind(this);
    this.handleShowLabelToggle = this.handleShowLabelToggle.bind(this);
    this.handleCancelGridPropertiesClick = this.handleCancelGridPropertiesClick.bind(this);

    this.state = {
      showGrid: false,
      showGridLabel: false,
      overlayDivs: '',
      overlayLabel: [],
      renderLabels: false,
      gridOverlay: null,
      loaded: false,
    };

    this.viewer = null;
  }

  async componentDidMount() {
    if (!noSlidesFound(this.props.selectedParticipant, this.props.handleError)) {
      this.renderOverlayLabels();
      this.initSeaDragon();
    }
    this.setState({ loaded: true });
  }

  async componentDidUpdate(prevProps) {
    // Only re-init if the slide actually changed
    const prevSlideId = prevProps.selectedParticipant?.selectedSlide?.id;
    const currentSlideId = this.props.selectedParticipant?.selectedSlide?.id;

    if (prevSlideId !== currentSlideId) {
      this.destroyViewer();
      noSlidesFound(this.props.selectedParticipant, this.props.handleError);
      this.renderOverlayLabels();
      this.initSeaDragon();
    }
  }

  componentWillUnmount() {
    this.destroyViewer();
  }

  destroyViewer() {
    if (this.viewer) {
      this.viewer.destroy();
      this.viewer = null;
    }
  }

  renderOverlayLabels() {
    const slide = this.props.selectedParticipant.selectedSlide;

    if (slide.slideType === "(LM) Light Microscopy" && !slide.removed) {
      this.setState({
        overlayLabel: slide.metadata.overlayLabel,
        gridOverlay: slide.metadata.overlay,
        renderLabels: true,
      });
    } else {
      this.setState({
        overlayLabel: [],
        gridOverlay: null,
        renderLabels: false,
      });
    }
  }

  initSeaDragon() {
    const slideId = this.props.selectedParticipant.selectedSlide.id;

    OpenSeadragon.setString("Tooltips.Home", "Reset pan & zoom");

    this.viewer = OpenSeadragon({
      id: "osdId",
      visibilityRatio: 0.5,
      constrainDuringPan: false,
      defaultZoomLevel: 1,
      minZoomLevel: 0.5,
      maxZoomLevel: 40, // Lowered from 120 for performance
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
    this.setState((prev) => ({
      showGrid: !prev.showGrid,
      showGridLabel: prev.showGrid ? false : prev.showGridLabel
    }));
  }

  handleShowLabelToggle() {
    this.setState((prev) => ({
      showGrid: true,
      showGridLabel: !prev.showGridLabel
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
          {this.state.loaded && (
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
          )}

          <div className="osd-div" ref={(node) => { this.el = node; }}>
            <div
              className={`openseadragon ${this.state.showGrid ? 'showGridlines' : 'hideGridlines'}`}
              id="osdId"
            ></div>
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
    );
  }
}

SlideViewer.propTypes = {
  selectedParticipant: PropTypes.object.isRequired,
  handleError: PropTypes.func.isRequired
};

export default SlideViewer;
