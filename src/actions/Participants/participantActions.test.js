jest.mock('axios', () => {
	const get = jest.fn();
	return {
		__esModule: true,
		default: {
			get,
			create: jest.fn(() => ({ get }))
		}
	};
});

import axios from 'axios';
import { setSelectedParticipant, setParticipants, getSlideMetadata } from './participantActions';
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

describe('getSlideMetadata', () => {
	it('should return metadata and dispatch the selected metadata action', async () => {
		const dispatch = jest.fn();
		const metadata = { overlayLabel: ['label'], overlay: [] };
		axios.get.mockResolvedValue({ data: metadata });

		const result = await getSlideMetadata('participant-1', 'slide-1')(dispatch);

		expect(axios.get).toHaveBeenCalledWith(
			'/api/v1/metadata/participant-1/slide-1',
			expect.objectContaining({ headers: expect.any(Object) })
		);
		expect(dispatch).toHaveBeenCalledWith({ type: actionNames.SET_SELECTED_METADATA, payload: metadata });
		expect(result).toEqual(metadata);
	});

	it('should ignore canceled out-of-order requests', async () => {
		const dispatch = jest.fn();
		const cancelError = new Error('Canceled');
		cancelError.__CANCEL__ = true;
		axios.isCancel = jest.fn(() => true);
		axios.get.mockRejectedValue(cancelError);

		const result = await getSlideMetadata('participant-1', 'slide-1', { signal: {} })(dispatch);

		expect(result).toBeNull();
		expect(dispatch).not.toHaveBeenCalledWith({ type: actionNames.SET_SELECTED_METADATA, payload: expect.anything() });
	});
});

