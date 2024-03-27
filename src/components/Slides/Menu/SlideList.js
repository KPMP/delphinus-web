import React, { Component } from 'react';
import { Col, Row, UncontrolledAccordion, AccordionItem, AccordionHeader, AccordionBody} from 'reactstrap';
import {
	noSlidesFound,
	getStainImageName
} from '../slideHelpers.js';
import AccordionList from './AccordionList.js';
import PropTypes from 'prop-types';


import Header from './Header';

class SlideList extends Component {

	constructor(props) {
		super(props);
		this.handleSelectSlide = this.handleSelectSlide.bind(this);
	}

	handleSelectSlide(slide) {
		this.props.setSelectedSlide(slide);
		this.props.toggleMenu(true);
	}

	componentDidUpdate() {
		noSlidesFound(this.props.selectedParticipant);
	}

	render() {
		let slideType = this.props.selectedParticipant.selectedSlide.slideType;
		return (
			<div id="menu-slide-list">
				<Header {...this.props} />
				<Col id="slides-col">
          <UncontrolledAccordion defaultOpen={['1', '2', '3']} stayOpen >
            {slideType === "(LM) Light Microscopy" ? <AccordionList selectedParticipant={this.props.selectedParticipant} slideType={slideType} accordionId='1' targetId='1' /> : ''}
            {slideType === "(EM) Electron Microscopy" ? <AccordionList selectedParticipant={this.props.selectedParticipant} slideType={slideType} accordionId='2' targetId='2' /> : ''}
            {slideType === "(IF) Immunoflourescence" ? <AccordionList selectedParticipant={this.props.selectedParticipant} slideType={slideType} accordionId='3' targetId='3' /> : ''}
   
          </UncontrolledAccordion>
				</Col>
			</div>
		);

	}
}

SlideList.propTypes = {
	selectedParticipant: PropTypes.object.isRequired,
	setSelectedSlide: PropTypes.func.isRequired,
	toggleMenu: PropTypes.func.isRequired,
	handleSelectSlide: PropTypes.func.isRequired
}

export default SlideList;
