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
        		<Select size='large' 
	        		className='participant-select-dropdown pr-3' 
	        		labelInValue 
	        		optionFilterProp="children"
	        		defaultValue={{ key: 'Select a KPMP ID' }} 
	        	    onChange={this.handleChange} 
	        		placeholder='Select a KPMP ID' 
	        		getPopupContainer={() => document.getElementById('participant-select-wrapper')}
	        		allowClear showSearch={true}
        		    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
	        	    onSearch={this.handleSearch}>
        		
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
