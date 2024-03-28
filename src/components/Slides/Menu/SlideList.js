import React, { Component } from 'react';
import { Col, UncontrolledAccordion} from 'reactstrap';
import {
	noSlidesFound,
} from '../slideHelpers.js';
import PropTypes from 'prop-types';


import Header from './Header';
import AccordionListContainer from './AccordionListContainer.js';

class SlideList extends Component {

	componentDidUpdate() {
		noSlidesFound(this.props.selectedParticipant);
	}

  async componentDidMount() {
    await this.props.slideType
  }

	render() {
		let slideType = this.props.selectedParticipant.selectedSlide.slideType;
    console.log(this.props.selectedParticipant)
		return (
			<div id="menu-slide-list">
				<Header {...this.props} />
				<Col id="slides-col">
        <UncontrolledAccordion defaultOpen={['1', '2', '3']} stayOpen >
          {
            Object.keys(this.props.selectedParticipant.selectedSlide).map(function (slide, index){
              return (
                <AccordionListContainer toggleMenu={this.props.toggleMenu} selectedParticipant={this.props.selectedParticipant} slideType={slide} accordionId={index} targetId={index} />
              )
            })
          }
        {/* {slideType === "(LM) Light Microscopy" ? <AccordionListContainer toggleMenu={this.props.toggleMenu} selectedParticipant={this.props.selectedParticipant} slideType={slideType} accordionId='1' targetId='1' /> : null}
        {slideType === "(EM) Electron Microscopy" ? <AccordionListContainer toggleMenu={this.props.toggleMenu} selectedParticipant={this.props.selectedParticipant} slideType={slideType} accordionId='2' targetId='2' /> : null}
        {slideType === "(IF) Immunoflourescence" ? <AccordionListContainer toggleMenu={this.props.toggleMenu} selectedParticipant={this.props.selectedParticipant} slideType={slideType} accordionId='3' targetId='3' /> : null} */}
      </UncontrolledAccordion>
				</Col>
			</div>
		);

	}
}

SlideList.propTypes = {
	selectedParticipant: PropTypes.object.isRequired,
}

export default SlideList;
