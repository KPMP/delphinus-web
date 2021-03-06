import React, { Component } from 'react';
class DivOverlays extends Component {
    render() {
        let labels = '';
        if (this.props.overlayLabels) {
            labels = this.props.overlayLabels.map((item, i) => {
                return <div
                    key={`labelOverlay-${item}-${this.props.labelSetId}`}
                    id={`labelOverlay-${item}-${this.props.labelSetId}`}
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
export default DivOverlays;