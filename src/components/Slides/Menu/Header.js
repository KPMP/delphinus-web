import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretLeft, faChevronRight, faChevronLeft, faDownload } from '@fortawesome/free-solid-svg-icons';
import { Col, Row } from 'reactstrap';
import ReactGA from 'react-ga';
import SlidePrintManager from './SlidePrintManager';
import { getNextSlide, getPreviousSlide, downloadSlide } from '../slideHelpers.js';

class Header extends Component {
	
	constructor(props) {
		super(props);
        this.handleDownload = this.handleDownload.bind(this);
	}
	
    handleNextSlide() {
        let nextSlide = getNextSlide(this.props.selectedParticipant.slides, this.props.selectedParticipant.selectedSlide);
        this.props.setSelectedSlide(nextSlide);
        this.props.toggleMenu(true);
    }

    handlePreviousSlide() {
        let previousSlide = getPreviousSlide(this.props.selectedParticipant.slides, this.props.selectedParticipant.selectedSlide);
        this.props.setSelectedSlide(previousSlide);
        this.props.toggleMenu(true);
    }
    
    handleDownload() {
        ReactGA.event({
            category: 'Slide View',
            action: 'Download Slide',
            label: this.props.selectedParticipant.selectedSlide.slideName
        });
    	let downloadFileName = this.props.selectedParticipant.selectedSlide.slideName + ".jpg";
    	downloadSlide(downloadFileName);
    }

	render() {
		return(
			<div className="menu-slide-list-header">
				<Row>
					<Col className="menu-title">WHOLE SLIDE IMAGES</Col>
                    <div className="float-right">
					    <Col className="menu-control"><FontAwesomeIcon icon={faCaretLeft} className="clickable" onClick={this.props.toggleMenu} size="lg"/></Col>
				    </div>
                </Row>
				<Row>
					<Col className="float-left" xs="6">
						<FontAwesomeIcon icon={faChevronLeft} className="clickable hoverable pad-right" onClick={() => this.handlePreviousSlide()} size="lg"/>
						<FontAwesomeIcon icon={faChevronRight} className="clickable hoverable" onClick={() => this.handleNextSlide()} size="lg"/>
					</Col>
				    <Col xs="6">
				    	<div className="float-right">
				            <a id="download" //eslint-disable-line
				            ><FontAwesomeIcon icon={faDownload} className="clickable hoverable" onClick={this.handleDownload} size="lg" /></a>
			            </div>
				    </Col>
				</Row>
        	</div>
		);
	}
	
}

export default Header;