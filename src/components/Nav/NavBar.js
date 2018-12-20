import React, { Component } from 'react';
import { Row, NavbarBrand, Col, Button } from 'reactstrap';

class NavBar extends Component {
	render() {
		return (
			<Row className="nav-container container-fluid">
				<Col xs="3">
					<NavbarBrand href={process.env.PUBLIC_URL + "/"}>
						<img src="img/logo.png" alt="Digital Pathology Repository" className="logo"/>
					</NavbarBrand>
				</Col>
				<Col xs="6" id="demo-text">Slide Viewer Concept
				</Col>
				<Col xs="6" id="demo-text-small"></Col>
				<Col xs="3">
					<div className="float-right" id="feedback-button"><Button color="primary" onClick={() => window.open("", "_blank")}>Send Feedback</Button></div>
				</Col>
			</Row>
			
		);
	}
}

export default NavBar;