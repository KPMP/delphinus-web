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
			open: this.props.selectedParticipant.selectedAccordion,
			openItems: [],
      number: 0
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
		const { openItems } = this.state;
		return (
			<div id="menu-slide-list">
				<Header number={this.state.number} {...this.props} />
        {console.log(this.state.number)}
				<Col id="slides-col">
					<Accordion toggle={this.toggle} open={openItems} stayOpen>
						{
							Object.keys(this.props.selectedParticipant.slides).map(function (slide, index){
								const slideType = Object.keys(this.props.selectedParticipant.slides)[index];
								const toggleMenu = this.props.toggleMenu;
								const selectedParticipant = this.props.selectedParticipant;
								return (
									<AccordionListContainer
										key={slideType}
										toggleMenu={toggleMenu}
										selectedParticipant={selectedParticipant}
										slideType={slideType}
										accordionId={slideType}
										targetId={slideType} />
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
