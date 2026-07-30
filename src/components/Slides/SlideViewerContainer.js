import { connect } from 'react-redux';
import SlideViewer from './SlideViewer';
import { sendMessageToBackend } from '../../actions/Error/errorActions';
import { getSlideMetadata } from '../../actions/Participants/participantActions';

const mapStateToProps = (state, props) =>
({
    selectedParticipant: state.selectedParticipant,
    participants: state.participants
});

const mapDispatchToProps = (dispatch, props) =>
({
    handleError(error) {
        dispatch(sendMessageToBackend(error));
    },
    getSelectedMetadata(participantId, slideName, options){
        return dispatch(getSlideMetadata(participantId, slideName, options));
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(SlideViewer);