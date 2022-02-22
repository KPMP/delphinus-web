import React, { Component } from 'react';
import { Col, Row } from 'reactstrap';
import {
	noSlidesFound,
	getStainImageName
} from '../slideHelpers.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBorderAll } from '@fortawesome/free-solid-svg-icons';
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
		
		return (
			<div id="menu-slide-list">
				<Header {...this.props} />
				<Col id="slides-col">
					<div id="menu-slide-list-slides">
						{
							this.props.selectedParticipant.slides.map(function (slide, index) {
								let highlightedClass = this.props.selectedParticipant.selectedSlide.id === slide.id ? " slide-highlighted" : "";
								let thumbnailSrc = "img/thumbnail_stain_" + getStainImageName(slide.stain.type) + ".png";
								return (
									<Row className={"slide-menu-item " + highlightedClass} onClick={() => this.handleSelectSlide(slide)}>
										<Col xs={{ size: "auto" }} className="no-padding"><img className="thumbnail noselect" src={thumbnailSrc} alt="" /></Col>
										<Col xs={{ size: "auto" }} className="slide-name">{slide.slideName}</Col>
										 <Col className="grid-icon" xs={{ size: "auto" }}><FontAwesomeIcon icon={faBorderAll} /></Col>
									</Row>
								)
							}, this)
						}
					</div>
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
