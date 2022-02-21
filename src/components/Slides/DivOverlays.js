import React, { Component } from 'react';
import PropTypes from 'prop-types';

class DivOverlays extends Component {
    render() {
        let labels = '';
        if (this.props.overlayLabels) {
            labels = this.props.overlayLabels.map((item, i) => {
                return <div
                    key={`labelOverlay-${item}`}
                    id={`labelOverlay-${item}`}
                    className={`labelOverlay ${this.props.showGridLabel ? '' : 'hideLabels'}`}>

                    <div>
                        {item}
                    </div>
                </div>
            })
        }

        return (
            <div>
                {labels}
            </div>
        )
    }
}

DivOverlays.propTypes = {
    showGridLabel: PropTypes.bool.isRequired,
    overlayLabels: PropTypes.array.isRequired
}

export default DivOverlays;