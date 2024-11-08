import actionNames from '../../actions/actionNames';

export const selectedParticipant = (state = {}, action) => {
    switch(action.type) {
        case actionNames.SET_SELECTED_PARTICIPANT:
            return action.payload;
        case actionNames.SET_SELECTED_SLIDE:
            return {...state, selectedSlide: action.payload};
        case actionNames.SET_SELECTED_ACCORDION:
            return {...state, selectedAccordion: action.payload}
        default:
            return state;
    }
};

export const participants = (state = [], action) => {
    switch(action.type) {
        case actionNames.SET_PARTICIPANTS:
            return action.payload;
        default:
            return state;
    }
};