import React, { Component } from "react";
import { Row, Col, AccordionItem, AccordionHeader, AccordionBody } from "reactstrap";
import PropTypes from 'prop-types';
import {
	getStainImageName
} from '../slideHelpers.js';

class AccordionList extends Component {

  constructor(props) {
		super(props);
		this.handleSelectSlide = this.handleSelectSlide.bind(this);
    this.handleSelectedAccordion = this.handleSelectedAccordion.bind(this);
	}

  handleSelectedAccordion(accordion){
    this.props.setSelectedAccordion(accordion)
  }

  handleSelectSlide(slide, accordion) {
		this.props.setSelectedSlide(slide);
    this.handleSelectedAccordion(accordion);
		this.props.toggleMenu(true);
	}

  render() {
    return (
      <AccordionItem>
              <AccordionHeader onClick={() => this.handleSelectedAccordion(this.props.slideType)} targetId={this.props.targetId}>
                {this.props.slideType}
              </AccordionHeader>
              <AccordionBody accordionId={this.props.accordionId}>
              <div id="menu-slide-list-slides">
                {
                  this.props.selectedParticipant.slides[this.props.slideType].map(function (slide, index) {
                    let highlightedClass = this.props.selectedParticipant.selectedSlide.id === slide.id ? " slide-highlighted" : "";
                    let thumbnailSrc = "img/thumbnail_stain_" + getStainImageName(slide.stain.type) + ".png";
                    return (
                      <Row className={"slide-menu-item " + highlightedClass} onClick={() => this.handleSelectSlide(slide, this.props.slideType)}>
                        <Col xs={{ size: "auto" }} className="no-padding"><img className="thumbnail noselect" src={thumbnailSrc} alt="" /></Col>
                        <Col xs={{ size: "auto" }} className="slide-name">{slide.slideName}</Col>
                      </Row>
                    )
                  }, this)
                }
            </div>
        </AccordionBody>
      </AccordionItem>
    )
  }
}

AccordionList.propTypes = {
  targetId: PropTypes.bool.isRequired,
  accordionId: PropTypes.bool.isRequired,
  slideType: PropTypes.bool.isRequired,
  selectedParticipant: PropTypes.bool.isRequired,
  setSelectedSlide: PropTypes.func.isRequired,
	toggleMenu: PropTypes.func.isRequired,
	handleSelectSlide: PropTypes.func.isRequired
}

export default AccordionList;