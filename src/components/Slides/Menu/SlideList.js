import React, { Component } from 'react';
import { Col, Accordion} from 'reactstrap';
import {
	noSlidesFound,
} from '../slideHelpers.js';
import PropTypes from 'prop-types';
import Header from './Header';
import AccordionListContainer from './AccordionListContainer.js';

class SlideList extends Component {
  constructor(props) {
		super(props);
		this.state = {
			openItems: [] // Array to store open accordion items
		};
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

	render() {
    console.log(this.props)
    const { openItems } = this.state.openItems; 
		return (
			<div id="menu-slide-list">
				<Header openItems={openItems} {...this.props} />
				<Col id="slides-col">
        <Accordion toggle={this.toggle} open={openItems} stayOpen>
          {
            Object.keys(this.props.selectedParticipant.slides).map(function (slide, index){
              let slideType = Object.keys(this.props.selectedParticipant.slides)[index]
              let toggleMenu = this.props.toggleMenu;
              let selectedParticipant = this.props.selectedParticipant;
              let strIndex = index.toString()
              return (
                <AccordionListContainer 
                  toggleMenu={toggleMenu}
                  selectedParticipant={selectedParticipant} 
                  slideType={slideType} 
                  accordionId={strIndex} 
                  targetId={strIndex} />
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