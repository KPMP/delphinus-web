import actionNames from '../actionNames';
import axios from 'axios';
import participantSelectSorter from '../../components/Summary/participantSelectSorter';
import { sendMessageToBackend } from '../Error/errorActions';
import { set } from 'lodash';

export const setSelectedParticipant = (participant) => {
    return {
        type: actionNames.SET_SELECTED_PARTICIPANT,
        payload: participant
    }
}

export const setSelectedSlide = (slide) => {
	return {
		type: actionNames.SET_SELECTED_SLIDE,
		payload: slide
	}
}

export const setParticipants = (participants) => {
	return {
		type: actionNames.SET_PARTICIPANTS,
		payload: participants
	}
}

export const getParticipantSlides = (participantId, props) => {
	return (dispatch) => {
		var config = { headers: {'Content-Type': 'application/json', 'Cache-control': 'no-cache'}};
		axios.get('/api/v1/slides/' + participantId, config)
			.then(result => {
        let newData = {}
        for(const [key, value] of Object.entries(result.data)){
          let newValue = participantSelectSorter(value);
          newData[key] = newValue
        }
        console.log(newData)
        dispatch(setSelectedParticipant({id: participantId, slides: newData, selectedSlide:newData["(LM) Light Microscopy"][0]}));
				props.history.push(process.env.PUBLIC_URL + "/slides");
			})
			.catch(err => {
				console.log("We were unable to get a list of slides for " + participantId);
				dispatch(sendMessageToBackend(err));
			});
	}
}

export const getAllParticipants = () => {
	return (dispatch) => {
		var config = { headers: {'Content-Type': 'application/json', 'Cache-control': 'no-cache'}}
		axios.get('/api/v1/slides', config)
			.then(result => {
				let participants = result.data;
				dispatch(setParticipants(participants));
			})
			.catch(err => {
				console.log("We were unable to get the slides.");
				dispatch(sendMessageToBackend(err));
			});
	}
}