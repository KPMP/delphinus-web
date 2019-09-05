import React, { Component } from 'react';
import { slide as BurgerMenu } from 'react-burger-menu';
import SlideListContainer from './SlideListContainer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faHome } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

class Menu extends Component {
	
	constructor(props) {
		super(props);
		this.state = { isOpen: false };
	}
	
	toggleMenu = (newState) => {
		let openState = !this.state.isOpen;
		if (newState !== undefined || newState !== null) {
			openState = newState;
		}
		this.setState( { isOpen: openState } );
	}
	
	render() {
		return (
			<div id="side-menu">
				<BurgerMenu id={ "bm-menu-wrap" } width={"33%"} isOpen={ this.state.isOpen } noOverlay customBurgerIcon={ <FontAwesomeIcon icon={faBars} /> }
					customCrossIcon={ false } >
					<SlideListContainer toggleMenu={this.toggleMenu}/>
				</BurgerMenu>
                <Link id="btn-home" to={process.env.PUBLIC_URL}>
                    <FontAwesomeIcon icon={faHome} size="2x"/>
                </Link>
            </div>
		);
	}
	
}

export default Menu;