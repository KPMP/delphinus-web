import actionNames from '../../actions/actionNames';
import { selectedParticipant } from './participantSelectReducer';

describe('selectedParticipant reducer', () => {
    it('adds metadata to the selected slide when metadata is received', () => {
        const state = {
            id: 'participant-1',
            selectedSlide: {
                id: 'slide-1',
                slideName: 'slide-a'
            }
        };

        const action = {
            type: actionNames.SET_SELECTED_METADATA,
            payload: { overlay: ['a'], overlayLabel: ['A'] }
        };

        const result = selectedParticipant(state, action);

        expect(result.selectedSlide.metadata).toEqual({ overlay: ['a'], overlayLabel: ['A'] });
    });
});
