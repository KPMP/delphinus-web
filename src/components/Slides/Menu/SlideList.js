import React, { Component } from 'react';
import { Col, Accordion } from 'reactstrap';
import { noSlidesFound } from '../slideHelpers.js';
import PropTypes from 'prop-types';
import Header from './Header';
import AccordionListContainer from './AccordionListContainer.js';

class SlideList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: this.props.selectedParticipant.selectedAccordion,
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
    const { openItems } = this.state;
    return (
      <div id="menu-slide-list">
        <Header
          selectedParticipant={this.props.selectedParticipant}
          setSelectedAccordion={selectedAccordion => this.setState({ open: selectedAccordion })}
          openItems={openItems}
          toggleMenu={this.props.toggleMenu}
          handlePreviousSlide={this.handlePreviousSlide}
          handleNextSlide={this.handleNextSlide}
          showGrid={this.props.showGrid}
          handleShowGridToggle={this.props.handleShowGridToggle}
          horizontal={this.props.horizontal}
          horizontalRef={this.props.horizontalRef}
          vertical={this.props.vertical}
          verticalRef={this.props.verticalRef}
          handleShowLabelToggle={this.props.handleShowLabelToggle}
          handleSetGridPropertiesClick={this.props.handleSetGridPropertiesClick}
          handleCancelGridPropertiesClick={this.props.handleCancelGridPropertiesClick}
        />
        <Col id="slides-col">
          <Accordion toggle={this.toggle} open={openItems} stayOpen>
            {Object.keys(this.props.selectedParticipant.slides).map((slide, index) => {
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
                  targetId={slideType}
                />
              );
            })}
          </Accordion>
        </Col>
      </div>
    );
  }
}

SlideList.propTypes = {
  selectedParticipant: PropTypes.object.isRequired,
  toggleMenu: PropTypes.func.isRequired,
  showGrid: PropTypes.bool,
  handleShowGridToggle: PropTypes.func.isRequired,
  horizontal: PropTypes.number.isRequired,
  horizontalRef: PropTypes.func.isRequired,
  vertical: PropTypes.number.isRequired,
  verticalRef: PropTypes.func.isRequired,
  handleShowLabelToggle: PropTypes.func.isRequired,
  handleSetGridPropertiesClick: PropTypes.func.isRequired,
  handleCancelGridPropertiesClick: PropTypes.func.isRequired
};

export default SlideList;
