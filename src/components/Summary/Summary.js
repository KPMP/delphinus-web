import React, { Component } from 'react';
import ParticipantSelectContainer from './ParticipantSelectContainer';
import { Container } from 'reactstrap';

class Summary extends Component {
	
	componentDidMount() {
		document.body.classList.remove('slide-viewer-body');
	}
	
    render() {
        return (
        	<Container fluid>
        		<div id='summary-page'>
        			<div id='participant-select-wrapper'>
        				<p>
        					Select a KPMP ID and click view slides to get started:
        				</p>
        				<ParticipantSelectContainer />
        			</div>
        		</div>
        	</Container>
        );
    }
}

export default Summary;
