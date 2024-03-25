import actionNames from '../actionNames';
import axios from 'axios';
import participantSelectSorter from '../../components/Summary/participantSelectSorter';
import { sendMessageToBackend } from '../Error/errorActions';

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
        console.log(result)
        console.log(result.data)
				let slides = participantSelectSorter(result.data);
				dispatch(setSelectedParticipant({id: participantId, slides: slides, selectedSlide: slides[0]}));
				props.history.push(process.env.PUBLIC_URL + "/slides");
			})
			.catch(err => {
				console.log("We were unable to get a list of slides for  " + participantId);
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