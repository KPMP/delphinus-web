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

	render() {
    console.log(this.props)
    console.log(this.props.selectedParticipant)
		return (
			<div id="menu-slide-list">
				<Header {...this.props} />
				<Col id="slides-col">
        <UncontrolledAccordion defaultOpen={0} stayOpen >
          {
            Object.keys(this.props.selectedParticipant.slides).map(function (slide, index){
              let slideType = Object.keys(this.props.selectedParticipant.slides)[index]
              let toggleMenu = this.props.toggleMenu;
              let selectedParticipant = this.props.selectedParticipant;
              return (
                <AccordionListContainer toggleMenu={toggleMenu} selectedParticipant={selectedParticipant} slideType={slideType} accordionId={index} targetId={index} />
              )
            }, this)
          }
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
