import React, { Component } from 'react';
import { Row, NavbarBrand, Col } from 'reactstrap';

class NavBar extends Component {
	render() {
		return (
			<Row className="nav-container container-fluid">
				<Col sm="1">
					<NavbarBrand href="/">
						<img src="img/logo.png" alt="Patient Slide Viewer" className="logo"/>
					</NavbarBrand>
				</Col>
				<Col sm="11">
					<div className="demo-text"><span className="highlight">DEMO:</span> Digital Pathology Repository - Slide Viewer Functionality</div>
				</Col>
			</Row>
			
		);
	}
}

export default NavBar;