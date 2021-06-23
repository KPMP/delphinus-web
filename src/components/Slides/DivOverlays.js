import React, { Component } from 'react';
class DivOverlays extends Component {

    render() {
        let labels = '';

        if (this.props.overlayLabels) {
            labels = this.props.overlayLabels.map((item, i) => {
                return <div
                    key={`labelOverlay-${item}`}
                    id={`labelOverlay-${item}`}
                    className={`labelOverlay ${this.props.showGridLabel ? '' : 'hideLabels'}`}>
                    {item}
                </div>
            })
        } else {
            labels = ''
        }


        return (
            <div>
                {labels}
            </div>
        )
    }
}
export default DivOverlays;