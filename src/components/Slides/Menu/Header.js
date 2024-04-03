import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faCaretLeft,
	faChevronRight,
	faChevronLeft,
	faDownload,
	faSquare,
	faCheckSquare,
	faCaretDown
} from '@fortawesome/free-solid-svg-icons';
import { Col, Row } from 'reactstrap';
import { downloadSlide } from '../slideHelpers.js';
import GridProperties from './GridProperties.js';
import PropTypes from 'prop-types';
import { handleGoogleAnalyticsEvent } from '../../../helpers/googleAnalyticsHelper.js';

class Header extends Component {
	constructor(props) {
		super(props);
		this.state = { showGridProperties: false, currentSlideTypeIndex: 0, slidePosition: 0 }
		this.handleShowGridProperties = this.handleShowGridProperties.bind(this)
		this.handleDownload = this.handleDownload.bind(this);
		this.textInput = React.createRef();
		this.focusTextInput = this.focusTextInput.bind(this);
    this.handleNextSlide = this.handleNextSlide.bind(this);
    this.handlePreviousSlide = this.handlePreviousSlide.bind(this);
	}

	focusTextInput() {
		// Explicitly focus the text input using the raw DOM API
		// Note: we're accessing "current" to get the DOM node
		this.textInput.current.focus();
	}
  handleNextSlide() {
    let slidePosition = this.state.slidePosition + 1;
    let currentSlideTypeIndex = this.state.currentSlideTypeIndex;
    let slideTypes = Object.keys(this.props.selectedParticipant.slides);
    slideTypes.sort();
    slideTypes.reverse();
    
    if (slidePosition === this.props.selectedParticipant.slides[slideTypes[currentSlideTypeIndex]].length) {
        currentSlideTypeIndex += 1;
        slidePosition = 0;
        if (currentSlideTypeIndex >= slideTypes.length) {
            currentSlideTypeIndex = 0;
        }
    }
    let nextSlide = this.props.selectedParticipant.slides[slideTypes[currentSlideTypeIndex]][slidePosition];
    let activeAccordionTab;
    if (nextSlide === "(LM) Light Microscopy") {
        activeAccordionTab = "lmAccordion";
    } 
    else if (nextSlide === "(IF) Immunofluorescence") {
        activeAccordionTab = "ifAccordion";
    }
    else if (nextSlide === "(EM) Electron Microscopy"){
        activeAccordionTab = "emAccordion"
    }

    this.setState({ 
        slidePosition: slidePosition, 
        currentSlideTypeIndex: currentSlideTypeIndex,
    });
    this.props.setSelectedAccordion(activeAccordionTab)
    this.props.setSelectedSlide(nextSlide);
    this.props.toggleMenu(true);
}



handlePreviousSlide() {
  let slidePosition = this.state.slidePosition - 1;
  let currentSlideTypeIndex = this.state.currentSlideTypeIndex;
  let slideTypes = Object.keys(this.props.selectedParticipant.slides);
  slideTypes.sort();
  slideTypes.reverse();
  
  if (slidePosition < 0) {
      currentSlideTypeIndex -= 1;
      if (currentSlideTypeIndex < 0) {
          currentSlideTypeIndex = slideTypes.length - 1;
      }
      slidePosition = this.props.selectedParticipant.slides[slideTypes[currentSlideTypeIndex]].length - 1;
  }

  let previousSlide = this.props.selectedParticipant.slides[slideTypes[currentSlideTypeIndex]][slidePosition];
  let activeAccordionTab;
    if (previousSlide === "(LM) Light Microscopy") {
        activeAccordionTab = "lmAccordion";
    } 
    else if (previousSlide === "(IF) Immunofluorescence") {
        activeAccordionTab = "ifAccordion";
    }
    else if (previousSlide === "(EM) Electron Microscopy"){
        activeAccordionTab = "emAccordion"
    } 
    this.setState({ 
        slidePosition: slidePosition, 
        currentSlideTypeIndex: currentSlideTypeIndex,
        activeAccordion: activeAccordionTab 
    });
  this.props.setSelectedSlide(previousSlide);
  this.setState({ slidePosition: slidePosition, currentSlideTypeIndex: currentSlideTypeIndex });
  this.props.toggleMenu(true);
}


	handleDownload() {

		handleGoogleAnalyticsEvent('DPR', 'Download', 
		this.props.selectedParticipant.id 
		+ this.props.selectedParticipant.selectedSlide.slideName);

		let downloadFileName = this.props.selectedParticipant.selectedSlide.slideName + ".jpg";
		downloadSlide(downloadFileName);
	}

	handleShowGridProperties() {
		if (this.state.showGridProperties) {
			this.setState({ showGridProperties: false })
		} else {
			this.setState({ showGridProperties: true })
		}
	}

	render() {
    console.log(this.props)
		return (
			<div className="menu-slide-list-header">
				<Row>
					<Col className="menu-title">CASE ID: {this.props.selectedParticipant.id}
            <div className="float-end menu-control"><FontAwesomeIcon icon={faCaretLeft} className="clickable" onClick={this.props.toggleMenu} size="lg" /></div>
          </Col>
					
				</Row>
				<Row>
					<Col className="float-start" xs="4">
						<FontAwesomeIcon icon={faChevronLeft} className="clickable hoverable pad-right" onClick={() => this.handlePreviousSlide()} size="lg" />
						<FontAwesomeIcon icon={faChevronRight} className="clickable hoverable" onClick={() => this.handleNextSlide()} size="lg" />
					</Col>
					<Col xs={{ size: 5, offset: 2 }}>
						<div className='float-end' id="grid-control">
							<FontAwesomeIcon
								icon={(this.props.showGrid) ? faCheckSquare : faSquare}
								className="clickable hoverable gridCheckbox"
								onClick={this.props.handleShowGridToggle}
								size="lg" />

							<span>GRID</span>
							<FontAwesomeIcon
								icon={faCaretDown}
								className="clickable hoverable gridPropertiesCaret"
								onClick={this.handleShowGridProperties}
								size="lg"
							/>

						</div>
					</Col>
					<Col xs="1">
						<div className="float-end">
							<a id="download" //eslint-disable-line
							><FontAwesomeIcon icon={faDownload} className="clickable hoverable" onClick={this.handleDownload} size="lg" /></a>
						</div>
					</Col>
				</Row>
				{this.state.showGridProperties &&

					<GridProperties
						horizontalRef={this.props.horizontalRef}
						horizontal={this.props.horizontal}
						verticalRef={this.props.verticalRef}
						vertical={this.props.vertical}
						handleShowGridProperties={this.handleShowGridProperties}
						handleShowLabelToggle={this.props.handleShowLabelToggle}
						showGridLabel={this.props.showGridLabel}
						handleSetGridPropertiesClick={this.props.handleSetGridPropertiesClick}
						handleCancelGridPropertiesClick={this.props.handleCancelGridPropertiesClick}
						handleShowGridToggle={this.props.handleShowGridToggle}

					/>
				}

			</div>
		);
	}

}

Header.propTypes = {
	selectedParticipant: PropTypes.object.isRequired,
	setSelectedSlide: PropTypes.func.isRequired,
	toggleMenu: PropTypes.func.isRequired,
	handlePreviousSlide: PropTypes.func.isRequired,
	handleNextSlide: PropTypes.func.isRequired,
	showGrid: PropTypes.bool,
	handleShowGridToggle: PropTypes.func.isRequired,
	horizontal: PropTypes.number.isRequired,
	horizontalRef: PropTypes.func.isRequired,
	vertical: PropTypes.number.isRequired,
	verticalRef: PropTypes.func.isRequired,
	handleShowLabelToggle: PropTypes.func.isRequired,
	handleSetGridPropertiesClick: PropTypes.func.isRequired,
	handleCancelGridPropertiesClick: PropTypes.func.isRequired

}

export default Header;
