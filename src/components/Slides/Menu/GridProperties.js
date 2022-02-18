import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Col, Row } from 'reactstrap';

import { faCheckSquare } from '@fortawesome/free-solid-svg-icons';
import { faWindowClose as farWindowClose, faSquare } from '@fortawesome/free-regular-svg-icons';

class GridProperties extends Component {
    constructor(props) {
        super(props)
        this.state = { initialShowGridLabel: props.showGridLabel }
    }
    render() {
        return (
            <div className="menu-slide-list-header-child">
                <h6>Grid properties:</h6>
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
                <div className="showLabelCheckboxContainer">
                    <FontAwesomeIcon
                        icon={this.props.showGridLabel ? faCheckSquare : faSquare}
                        className="clickable hoverable showLabelsCheckbox"
                        onClick={this.props.handleShowLabelToggle}
                        size="lg" />
                    <label>Show labels</label>
                </div>
                <Row className="tightRow">
                    <Col xs={{ size: 1 }}>
                        <FontAwesomeIcon
                            icon={farWindowClose}
                            className="far clickable hoverable ctrl-btn"
                            onClick={() => {
                                this.props.handleCancelGridPropertiesClick(this.state.initialShowGridLabel);
                                this.props.handleShowGridProperties();
                            }}
                            size="lg" />
                    </Col>
                    <Col xs={{ size: 1 }}>
                        <FontAwesomeIcon
                            icon={faCheckSquare}
                            className="clickable hoverable ctrl-btn"
                            onClick={() => {
                                this.props.handleShowGridProperties();
                            }}
                            size="lg" />
                    </Col>
                </Row>
            </div>
        );
    }

}

export default GridProperties;