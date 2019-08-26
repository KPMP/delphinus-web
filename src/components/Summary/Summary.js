import React, { Component } from 'react';
import ParticipantSelectContainer from './ParticipantSelectContainer';

class Summary extends Component {
	
	componentDidMount() {
		document.body.classList.remove('slide-viewer-body');
	}
	
    render() {
        return (
            <div id="summary-page">
                <div id="participant-select-wrapper">
                    <p>
                        Select a KPMP ID and click view slides to get started:
                    </p>
                    <ParticipantSelectContainer />
                    <div className="alert-info content-warning">This is a demonstration of the slide viewing capabilities that will be in the Digital Pathology Repository. 
                    This demonstration has been pre-loaded with nephrectomy cases from Pilot 1.</div>
                </div>
            </div>
        );
    }
}

export default Summary;
