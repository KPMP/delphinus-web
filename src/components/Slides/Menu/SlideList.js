import React, { Component } from 'react';
import { Col, Accordion} from 'reactstrap';
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
		return (
			<div id="menu-slide-list">
				<Header {...this.props} />
				<Col id="slides-col">
        <Accordion defaultOpen={["0"]} stayOpen>
          {
            Object.keys(this.props.selectedParticipant.slides).map(function (slide, index){
              let slideType = Object.keys(this.props.selectedParticipant.slides)[index]
              let toggleMenu = this.props.toggleMenu;
              let selectedParticipant = this.props.selectedParticipant;
              // let strIndex = index.toString()
              return (
                <AccordionListContainer 
                  toggleMenu={toggleMenu}
                  selectedParticipant={selectedParticipant} 
                  slideType={slideType} 
                  accordionId={slideType} 
                  targetId={slideType} />
              )
            }, this)
          }
      </Accordion >
				</Col>
			</div>
		);

	}
}

SlideList.propTypes = {
	selectedParticipant: PropTypes.object.isRequired,
}

export default SlideList;