import React, { Component } from 'react';
import { Navbar, NavbarBrand, Col, Button } from 'reactstrap';
import { Link } from 'react-router-dom';

class NavBar extends Component {
	render() {
		return (
			<Navbar id="navbar" className="px-1 py-1 fixed-top">
				<Col sm={6}>
					<Link to="/" className="navbar-header">
						<NavbarBrand className="d-flex align-items-center">
							<img src="img/logo.png" alt="Kidney Precision Medicine Project Digital Pathology Repository" className="logo" />
							<span className="ml-2 text-dark">Digital Pathology Repository</span>
						</NavbarBrand>
					</Link>
				</Col>
				<Col sm={6} className="d-none d-md-block">
					<div className="float-right" id="feedback-button"><Button color="primary" onClick={() => window.open("https://goo.gl/forms/WkyC7PZM8AIe3NoI3", "_blank")}>Send Feedback</Button></div>
				</Col>
			</Navbar>
		);
	}
}

export default NavBar;