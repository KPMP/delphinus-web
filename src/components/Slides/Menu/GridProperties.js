import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Col, Row } from 'reactstrap';

import { faCheckSquare } from '@fortawesome/free-solid-svg-icons';
import { faWindowClose as farWindowClose, faSquare, faCheckSquare as farCheckSquare } from '@fortawesome/free-regular-svg-icons';

class GridProperties extends Component {
    render() {
        return (
            <div className="menu-slide-list-header-child">
                <p>Grid properties:</p>
                <div>
                    <label>Horizontal</label>
                    <input
                        disabled
                        defaultValue={this.props.horizontal}
                        ref={this.props.horizontalRef}
                        type="text" name="name" /><span className="micolabel">μm</span>
                </div>
                <div>
                    <label>Vertical</label>
                    <input
                        disabled
                        defaultValue={this.props.vertical}
                        ref={this.props.verticalRef}
                        type="text" name="name" /><span className="micolabel">μm</span>
                </div>

                <FontAwesomeIcon
                    icon={this.props.showGridLabels ? faCheckSquare : faSquare}
                    className="clickable hoverable showLabelsCheckbox"
                    onClick={this.props.handleShowLabel}
                    size="lg" />
                <label>Show labels</label>

                <Row >
                    <Col xs={{ size: 1, offset: 8 }}>
                        <FontAwesomeIcon
                            icon={farWindowClose}
                            className="far clickable hoverable ctrl-btn"
                            onClick={this.props.handleShowGridProperties}
                            size="lg" />
                    </Col>
                    <Col xs={{ size: 1 }}>
                        <FontAwesomeIcon
                            icon={faCheckSquare}
                            className="clickable hoverable ctrl-btn"
                            onClick={this.props.handleSetGridPropertiesClick}
                            size="lg" />
                    </Col>
                </Row>
            </div>
        );
    }

}

export default GridProperties;