import { combineReducers } from 'redux';
import actionNames from './actions/actionNames';
import loadedState from './initialState';
import { selectedPatient, patientSlides } from './components/Summary/patientSelectReducer';

const appReducer = combineReducers({
    selectedPatient,
    patientSlides
});

const rootReducer = (state, action) => {
    if(action.type === actionNames.RESET_STATE) {
        state = loadedState;
    }
    return appReducer(state, action);
}

export default rootReducer;
