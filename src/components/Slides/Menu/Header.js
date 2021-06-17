import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faCaretLeft,
	faChevronRight,
	faChevronLeft,
	faDownload,
	faPrint,
	faSquare,
	faCheckSquare,
	faCaretDown
} from '@fortawesome/free-solid-svg-icons';
import { Col, Row } from 'reactstrap';
import ReactGA from 'react-ga';
import { getNextSlide, getPreviousSlide, downloadSlide } from '../slideHelpers.js';
import GridProperties from './GridProperties.js';

class Header extends Component {
	constructor(props) {
		super(props);
		this.state = { showGridProperties: false }
		this.handleShowGridProperties = this.handleShowGridProperties.bind(this)
		this.handleDownload = this.handleDownload.bind(this);
		this.textInput = React.createRef();
		this.focusTextInput = this.focusTextInput.bind(this);
	}

	focusTextInput() {
		// Explicitly focus the text input using the raw DOM API
		// Note: we're accessing "current" to get the DOM node
		this.textInput.current.focus();
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
	handleShowGridProperties() {
		if (this.state.showGridProperties) {
			this.setState({ showGridProperties: false })
		} else {
			this.setState({ showGridProperties: true })
		}
	}

	render() {
		return (
			<div className="menu-slide-list-header">
				<Row>
					<Col className="menu-title">CASE ID: {this.props.selectedParticipant.id}</Col>
					<div className="float-right">
						<Col className="menu-control"><FontAwesomeIcon icon={faCaretLeft} className="clickable" onClick={this.props.toggleMenu} size="lg" /></Col>
					</div>
				</Row>
				<Row>
					<Col className="float-left" xs="6">
						<FontAwesomeIcon icon={faChevronLeft} className="clickable hoverable pad-right" onClick={() => this.handlePreviousSlide()} size="lg" />
						<FontAwesomeIcon icon={faChevronRight} className="clickable hoverable" onClick={() => this.handleNextSlide()} size="lg" />
					</Col>
					{/* <Col xs="3">
						<div className="float-right">
							<a id="download" //eslint-disable-line
							><FontAwesomeIcon icon={faCheckSquare} className="clickable hoverable" onClick={this.handleDownload} size="lg" /></a>
						</div>
					</Col> */}
					<Col xs="4">
						<div className="float-right">
							<FontAwesomeIcon
								icon={this.props.showGrid ? faCheckSquare : faSquare}
								className="clickable hoverable gridCheckbox"
								onClick={this.props.handleShowGridToggle}
								size="lg" />

							<span>GRID</span>
							<FontAwesomeIcon
								icon={faCaretDown}
								className="clickable hoverable gridPropertiesCaret"
								onClick={this.handleShowGridProperties}
								size="lg"
							/>

						</div>
					</Col>
					<Col xs="1">
						<div className="float-right">
							<a id="print" //eslint-disable-line
							><FontAwesomeIcon icon={faPrint} className="clickable hoverable" size="lg" /></a>
						</div>
					</Col>
					<Col xs="1">
						<div className="float-right">
							<a id="download" //eslint-disable-line
							><FontAwesomeIcon icon={faDownload} className="clickable hoverable" onClick={this.handleDownload} size="lg" /></a>
						</div>
					</Col>
				</Row>
				{this.state.showGridProperties &&

					<GridProperties
						horizontalRef={this.props.horizontalRef}
						horizontal={this.props.horizontal}
						verticalRef={this.props.verticalRef}
						vertical={this.props.vertical}
						handleShowGridProperties={this.handleShowGridProperties}
						handleSetGridPropertiesClick={this.props.handleSetGridPropertiesClick}
						handleShowGridToggle={this.props.handleShowGridToggle}

					/>
				}

			</div>
		);
	}

}

export default Header;