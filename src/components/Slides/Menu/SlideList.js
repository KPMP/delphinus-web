import React, { Component } from 'react';
import { Col, Accordion, Row, AccordionItem, AccordionHeader, AccordionBody} from 'reactstrap';
import {
	noSlidesFound,
} from '../slideHelpers.js';
import PropTypes from 'prop-types';
import Header from './Header';
import {
	getStainImageName
} from '../slideHelpers.js';

class SlideList extends Component {
	constructor(props) {
		super(props);
		this.state = {
			open: this.props.selectedParticipant.selectedAccordion,
      openItems: []
		};
    this.handleSelectSlide = this.handleSelectSlide.bind(this);
	}

	componentDidUpdate() {
		noSlidesFound(this.props.selectedParticipant);
	}

	toggle = (slideType) => {
		const { openItems } = this.state;
		if (openItems.includes(slideType)) {
			this.setState({ openItems: openItems.filter(item => item !== slideType) });
		} else {
			this.setState({ openItems: [...openItems, slideType] });
		}
	}

  handleSelectSlide(slide, accordion) {
		this.props.setSelectedSlide(slide);
    this.props.setSelectedAccordion(accordion)
		this.props.toggleMenu(true);
	}

	render() {
		const { openItems } = this.state;
		return (
			<div id="menu-slide-list">
				<Header number={this.state.number} {...this.props} />
				<Col id="slides-col">
					<Accordion toggle={this.toggle} open={openItems} stayOpen>
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
                              <Row className={"slide-menu-item " + highlightedClass} onClick={() => this.handleSelectSlide(slide, slideType)}>
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
