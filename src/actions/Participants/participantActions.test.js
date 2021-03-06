import { setSelectedParticipant, setParticipants } from './participantActions';
import actionNames from '../actionNames';


describe('setSelectedParticipant', () => {
	it('should pass the argument through to the payload and set the action', () => {
		let payload = "I am a payload";
		let actionName = actionNames.SET_SELECTED_PARTICIPANT;
		
		let result = setSelectedParticipant(payload);
		
		expect(result).toEqual( { payload: payload, type: actionName });
	});
});

describe('setParticipants', () => {
	it('should pass the argument through to the payload and set the action', () => {
		let payload = "I am a payload";
		let actionName = actionNames.SET_PARTICIPANTS;

		let result = setParticipants(payload);

		expect(result).toEqual( { payload: payload, type: actionName });
	});
});

