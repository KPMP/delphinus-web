import { combineReducers } from 'redux';
import actionNames from './actions/actionNames';
import loadedState from './initialState';
import { selectedParticipant, participants } from './components/Summary/participantSelectReducer';

const appReducer = combineReducers({
    selectedParticipant,
    participants
});

const rootReducer = (state, action) => {
    if(action.type === actionNames.RESET_STATE) {
        state = loadedState;
    }
    return appReducer(state, action);
}

export default rootReducer;
