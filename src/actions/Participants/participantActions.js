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
        let data = Object.keys(result.data)
        // if (result.data["(LM) Light Microscopy"] != null){
        //   let slides = participantSelectSorter(result.data["(LM) Light Microscopy"])
        //   // dispatch(setSelectedParticipant({id: participantId, slides: slides, selectedSlide: slides[0]}));
        // }
        // if (result.data["(IF) Immunofluorescence"] != null){
        //   let slides = participantSelectSorter(result.data["(IF) Immunofluorescence"])
        //   console.log("append IF")
        //   // dispatch(setSelectedParticipant({id: participantId, slides: slides, selectedSlide: slides[0]}));
        // }
        // if (result.data["(EM) Electron Microscopy"] != null){
        //   let slides = participantSelectSorter(result.data["(EM) Electron Microscopy"])
        //   console.log("append EM")
        //   // dispatch(setSelectedParticipant({id: participantId, slides: slides, selectedSlide: slides[0]}));
        // }

        for (let i = 0; i < data.length(); i ++ ){
          console.log(data[i]);
          // dispatch(setSelectedParticipant({id: participantId, slide: data[i], selectedSlide:data[i]}));
        }
        // dispatch(setSelectedParticipant({id: participantId, slides: data[index], selectedSlide: data[0]}));
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