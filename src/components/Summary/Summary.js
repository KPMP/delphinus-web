import React, { Component } from 'react';
import ParticipantSelectContainer from './ParticipantSelectContainer';

class Summary extends Component {
	
	componentDidMount() {
		document.body.classList.remove('slide-viewer-body');
	}
	
    render() {
        return (
            <div id="summary-page" className="container-fluid">
                <div id="participant-select-wrapper">
                    <p>
                        Select a KPMP ID and click view slides to get started:
                    </p>
                    <ParticipantSelectContainer />
                </div>
            </div>
        );
    }
}

export default Summary;
