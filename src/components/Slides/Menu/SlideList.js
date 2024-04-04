import React, { Component } from 'react';
import { Col, Accordion, AccordionItem, AccordionButton, AccordionPanel } from 'reactstrap'; // Import AccordionItem, AccordionButton, and AccordionPanel
import {
  noSlidesFound,
} from '../slideHelpers.js';
import PropTypes from 'prop-types';
import Header from './Header';
import AccordionListContainer from './AccordionListContainer.js';

class SlideList extends Component {
  componentDidUpdate() {
    noSlidesFound(this.props.selectedParticipant);
  }

  render() {
    const { selectedParticipant, toggleMenu } = this.props;

    return (
      <div id="menu-slide-list">
        <Header {...this.props} />
        <Col id="slides-col">
          <Accordion>
            {Object.keys(selectedParticipant.slides).map((slideType, index) => (
              <AccordionItem key={slideType}>
                <AccordionButton>
                  {slideType}
                </AccordionButton>
                <AccordionPanel>
                  <AccordionListContainer
                    toggleMenu={toggleMenu}
                    selectedParticipant={selectedParticipant}
                    slideType={slideType}
                    accordionId={slideType}
                    targetId={slideType}
                  />
                </AccordionPanel>
              </AccordionItem>
            ))}
          </Accordion>
        </Col>
      </div>
    );
  }
}

SlideList.propTypes = {
  selectedParticipant: PropTypes.object.isRequired,
  toggleMenu: PropTypes.func.isRequired,
};

export default SlideList;
