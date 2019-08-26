import React, { Component } from 'react';
import { Select } from 'antd';
import 'antd/es/select/style/index.css';
import PropTypes from 'prop-types';

class ParticipantListDropDown extends Component {

    handleChange = (selectedOption) => {
        this.props.handleParticipantSelect(selectedOption.key);
    };

    render() {
        const Option = Select.Option;
    	let { participants } = this.props;
        let options = participants.map((participant) => {
                return <Option value={participant.kpmpId}>{participant.label}</Option>
            }
        );
        return (
	        	<Select size="large" className="participant-select-dropdown" labelInValue defaultValue={{ key: 'Select a KPMP ID' }} onChange={this.handleChange}
	        		placeholder="Select a KPMP ID" getPopupContainer={() => document.getElementById("participant-select-wrapper")}>
	        		{options}
	        	</Select>
        );
    }

}

ParticipantListDropDown.propTypes = {
    handleParticipantSelect: PropTypes.func.isRequired,
    participants: PropTypes.array.isRequired
};
export default ParticipantListDropDown;
