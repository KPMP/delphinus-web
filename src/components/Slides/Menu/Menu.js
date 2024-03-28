import React, { Component } from 'react';
import { slide as BurgerMenu } from 'react-burger-menu';
import SlideListContainer from './SlideListContainer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faHome } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

class Menu extends Component {

	constructor(props) {
		super(props)
		this.state = { isOpen: false };
	}

	toggleMenu = (newState) => {
		let openState = !this.state.isOpen;
		if (newState !== undefined || newState !== null) {
			openState = newState;
		}
		this.setState({ isOpen: openState });
	}

	render() {
    console.log("Checking slide type in menu " + this.props.slideType)
		return (
			<div id="side-menu">
				<BurgerMenu id={"bm-menu-wrap"} width={"33%"} isOpen={this.state.isOpen} noOverlay customBurgerIcon={<FontAwesomeIcon icon={faBars} />}
					customCrossIcon={false} >
					<SlideListContainer
						showGrid={this.props.showGrid}
						showGridLabel={this.props.showGridLabel}
						handleShowGridToggle={this.props.handleShowGridToggle}
						handleShowLabelToggle={this.props.handleShowLabelToggle}
						handleCancelGridPropertiesClick={this.props.handleCancelGridPropertiesClick}
						horizontalRef={this.props.horizontalRef}
						verticalRef={this.props.verticalRef}
						horizontal={this.props.horizontal}
						vertical={this.props.vertical}
						toggleMenu={this.toggleMenu} 
            slideType={this.props.slideType}/>
				</BurgerMenu>
				<Link id="btn-home" to={process.env.PUBLIC_URL}>
					<FontAwesomeIcon icon={faHome} size="2x" />
				</Link>
			</div>
		);
	}

}

Menu.propTypes = {
	showGrid: PropTypes.bool.isRequired,
	showGridLabel: PropTypes.bool.isRequired,
	handleShowGridToggle: PropTypes.func.isRequired,
	handleShowLabelToggle: PropTypes.func.isRequired,
	handleCancelGridPropertiesClick: PropTypes.func.isRequired,
	horizontal: PropTypes.number.isRequired,
	horizontalRef: PropTypes.func.isRequired,
	vertical: PropTypes.number.isRequired,
	verticalRef: PropTypes.func.isRequired
}

export default Menu;