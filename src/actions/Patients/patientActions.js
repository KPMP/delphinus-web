import actionNames from '../actionNames';
import axios from 'axios';
import patientSelectSorter from '../../components/Summary/patientSelectSorter';
import { sendMessageToBackend } from '../Error/errorActions';

export const setSelectedPatient = (patient) => {
    return {
        type: actionNames.SET_SELECTED_PATIENT,
        payload: patient
    }
}

export const setSelectedSlide = (slide) => {
	return {
		type: actionNames.SET_SELECTED_SLIDE,
		payload: slide
	}
}

export const getPatientSlides = (patientId, props) => {
	return (dispatch) => {
		var config = { headers: {'Content-Type': 'application/json', 'Cache-control': 'no-cache'}}
		axios.get('/api/v1/slides/' + patientId, config)
			.then(result => {
				let slides = patientSelectSorter(result.data);
				dispatch(setSelectedPatient({id: patientId, slides: slides, selectedSlide: slides[0]}));
				props.history.push(process.env.PUBLIC_URL + "/slides");
			})
			.catch(err => {
				console.log("We were unable to get a list of slides for patient " + patientId);
				dispatch(sendMessageToBackend(err));
			});
	}
}