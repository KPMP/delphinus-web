import React, { Component } from 'react';
import { Col, Accordion, Row, AccordionItem, AccordionHeader, AccordionBody} from 'reactstrap';
import {
	noSlidesFound,
} from '../slideHelpers.js';
import PropTypes from 'prop-types';
import {
	getStainImageName
} from '../slideHelpers.js';
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
import { handleGoogleAnalyticsEvent } from '../../../helpers/googleAnalyticsHelper.js';
import { downloadSlide } from '../slideHelpers.js';
import GridProperties from './GridProperties.js';

class SlideList extends Component {
	constructor(props) {
		super(props);
		this.state = {
			open: "",
      openItems: [0],
      showGridProperties: false, 
      currentSlideTypeIndex: 0, 
      slidePosition: 0,
      slideIndex: 0,
      showCheckbox: true
		};
    this.handleShowGridProperties = this.handleShowGridProperties.bind(this)
		this.handleDownload = this.handleDownload.bind(this);
		this.textInput = React.createRef();
		this.focusTextInput = this.focusTextInput.bind(this);
    this.handleNextSlide = this.handleNextSlide.bind(this);
    this.handlePreviousSlide = this.handlePreviousSlide.bind(this);
    this.handleSelectSlide = this.handleSelectSlide.bind(this);
    this.handleSelectAccordion = this.handleSelectAccordion.bind(this);
    this.toggle = this.toggle.bind(this);
	}

	componentDidUpdate() {
		noSlidesFound(this.props.selectedParticipant);
	}

	toggle (slideTypeIndex) {
		let openItems = this.state.openItems;
    const openAccordion = openItems.includes(slideTypeIndex);

    if(!openAccordion){
      this.setState( prevState => ({
          openItems: [...prevState.openItems, slideTypeIndex]
      }));
    }
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

    this.setState({ 
        slidePosition: slidePosition, 
        currentSlideTypeIndex: currentSlideTypeIndex,
    });

    this.props.setSelectedAccordion(...this.props.selectedParticipant.slides[slideTypes[currentSlideTypeIndex]][slidePosition].slideType)
    this.handleShowGridCheckbox(this.props.selectedParticipant.slides[slideTypes[currentSlideTypeIndex]][slidePosition].slideType)
    this.toggle(currentSlideTypeIndex)
    this.props.setSelectedSlide(nextSlide);
    this.props.toggleMenu(true);
}

    handleShowGridCheckbox(slideType){
        if (slideType === "(EM) Electron Microscopy" || slideType === "(IF) Immunofluorescence"){
            this.setState({showCheckbox: false})
        }else{
            this.setState({showCheckbox:true})
        }
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
    this.setState({ 
        slidePosition: slidePosition, 
        currentSlideTypeIndex: currentSlideTypeIndex,
    });

  this.props.setSelectedAccordion(this.props.selectedParticipant.slides[slideTypes[currentSlideTypeIndex]][slidePosition].slideType)
  this.handleShowGridCheckbox(this.props.selectedParticipant.slides[slideTypes[currentSlideTypeIndex]][slidePosition].slideType)
  this.toggle(currentSlideTypeIndex)
  this.props.setSelectedSlide(previousSlide);
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

  handleSelectSlide(slide, accordion, slideIndex, accordionIndex) {
		this.props.setSelectedSlide(slide);
		this.props.toggleMenu(true);
    this.setState({currentSlideTypeIndex: accordionIndex, slidePosition: slideIndex})
    this.props.setSelectedAccordion(accordion)
    this.handleShowGridCheckbox(accordion);
	}

  handleSelectAccordion(accordion) {
    let openItems = this.state.openItems;
    
		if (openItems.includes(accordion)) {
			this.setState({ openItems: openItems.filter(item => item !== accordion) });
		} else {
			this.setState({ openItems: [...openItems, accordion] });
		}
    this.props.toggleMenu(true)
  }

	render() {
		let openItems = this.state.openItems
		return (
			<div id="menu-slide-list">
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
                    {
                    this.state.showCheckbox ? 
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
					    	</div> : null}
						
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
				<Col id="slides-col">
					<Accordion toggle={this.handleSelectAccordion} open={openItems} stayOpen>
						{
							Object.keys(this.props.selectedParticipant.slides).map(function (slide, accordionIndex){
								const slideType = Object.keys(this.props.selectedParticipant.slides)[accordionIndex];
								const selectedParticipant = this.props.selectedParticipant;
								return (
                  <AccordionItem>
                    <AccordionHeader targetId={accordionIndex}>
                      {slideType}
                    </AccordionHeader>
                    <AccordionBody accordionId={accordionIndex} >
                      <div id="menu-slide-list-slides">
                        {
                          selectedParticipant.slides[slideType].map(function (slide, slideIndex) {
                            let highlightedClass = selectedParticipant.selectedSlide.id === slide.id ? " slide-highlighted" : "";
                            let thumbnailSrc = "img/thumbnail_stain_" + getStainImageName(slide.stain.type) + ".png";
                            return (
                              <Row className={"slide-menu-item " + highlightedClass} onClick={() => this.handleSelectSlide(slide, slideType, slideIndex, accordionIndex)}>
                                <Col xs={{ size: "auto" }} className="no-padding"><img className="thumbnail noselect" src={thumbnailSrc} alt="" /></Col>
                                <Col xs={{ size: "auto" }} className="slide-name">{slide.slideName}</Col>
                              </Row>
                            )
                          },this)
                        }
                      </div>
                    </AccordionBody>
                  </AccordionItem>
								);
							}, this)
						}
					</Accordion>
				</Col>
			</div>
		);
	}
}

SlideList.propTypes = {
	selectedParticipant: PropTypes.object.isRequired,
}

export default SlideList;
