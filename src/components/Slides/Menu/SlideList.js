import React, { Component } from 'react';
import { Col, UncontrolledAccordion} from 'reactstrap';
import {
	noSlidesFound,
} from '../slideHelpers.js';
import PropTypes from 'prop-types';


import Header from './Header';
import AccordionListContainer from './AccordionListContainer.js';

class SlideList extends Component {

  constructor(props){
    super(props)
    this.state = {
      loaded: false
    }
  }

	componentDidUpdate() {
		noSlidesFound(this.props.selectedParticipant);
	}

  content(slideType) {
      <UncontrolledAccordion defaultOpen={['1', '2', '3']} stayOpen >
        {slideType === "(LM) Light Microscopy" ? <AccordionListContainer toggleMenu={this.props.toggleMenu} selectedParticipant={this.props.selectedParticipant} slideType={slideType} accordionId='1' targetId='1' /> : null}
        {slideType === "(EM) Electron Microscopy" ? <AccordionListContainer toggleMenu={this.props.toggleMenu} selectedParticipant={this.props.selectedParticipant} slideType={slideType} accordionId='2' targetId='2' /> : null}
        {slideType === "(IF) Immunoflourescence" ? <AccordionListContainer toggleMenu={this.props.toggleMenu} selectedParticipant={this.props.selectedParticipant} slideType={slideType} accordionId='3' targetId='3' /> : null}
      </UncontrolledAccordion>
  }

  async componentDidMount() {
    await this.props.slideType
    this.setState({loaded: true})
  }

	render() {
		let slideType = this.props.selectedParticipant.selectedSlide.slideType;
    console.log(this.state.loaded)
		return (
			<div id="menu-slide-list">
				<Header {...this.props} />
				<Col id="slides-col">
          {this.state.loaded ? this.content(slideType) : null}
				</Col>
			</div>
		);

	}
}

SlideList.propTypes = {
	selectedParticipant: PropTypes.object.isRequired,
}

export default SlideList;
