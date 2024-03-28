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
		return (
			<div id="menu-slide-list">
				<Header {...this.props} />
				<Col id="slides-col">
        <UncontrolledAccordion defaultOpen={['1', '2', '3']} stayOpen >
          {
            this.props.selectedParticipant.slides.map(function (slide, index){
              let slideType = slide.slideType;
              let toggleMenu = this.props.toggleMenu;
              let selectedParticipant = this.props.selectedParticipant;
              console.log(slideType)
              console.log(index)
              return (
                <AccordionListContainer toggleMenu={toggleMenu} selectedParticipant={selectedParticipant} slideType={slideType} accordionId={index} targetId={index} />
              )
            })
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
