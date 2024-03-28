import React, { Component } from 'react';
import { Button } from 'reactstrap';
import ParticipantListDropDown from './ParticipantListDropDown';
import ReactGA from 'react-ga4';
import PropTypes from 'prop-types';

class ParticipantSelect extends Component {

    constructor(props) {
        super(props);
        this.state = { participantId: null, buttonDisabled: true };
    }

    handleParticipantSelect = (participantId) => {
        ReactGA.event({
            category: 'DPR',
            action: 'Navigation',
            label: participantId
        });
        this.setState({participantId});
        this.setState({buttonDisabled: false});
    };

    async handleSelectedParticipant(participantId){
      await this.props.setSelectedParticipant(participantId)
      console.log(this.props.setSelectedParticipant(participantId))
    }

    handleClick = () => {
      this.handleSelectedParticipant(this.state.participantId);
    };

    componentDidMount() {
        this.props.getAllParticipants();
    }

    render() {
        return (
            <div className='participant-select-controls pull-left input-group'>
                <ParticipantListDropDown participants={this.props.participants} handleParticipantSelect={this.handleParticipantSelect}/>
                <Button color='primary' onClick={this.handleClick} disabled={this.state.buttonDisabled}>View Slides</Button>
            </div>
        );
    }

}

ParticipantSelect.propTypes = {
    setSelectedParticipant: PropTypes.func.isRequired,
    getAllParticipants: PropTypes.func.isRequired,
    participants: PropTypes.array.isRequired
};
export default ParticipantSelect;