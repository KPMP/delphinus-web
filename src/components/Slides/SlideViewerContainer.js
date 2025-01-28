import { connect } from 'react-redux';
import SlideViewer from './SlideViewer';
import { sendMessageToBackend } from '../../actions/Error/errorActions';
import { getMetadataForSlide } from '../../actions/Participants/participantActions';

const mapStateToProps = (state, props) =>
({
    selectedParticipant: state.selectedParticipant,
    participants: state.participants
});

const mapDispatchToProps = (dispatch, props) =>
({
    setSlideMetadata(participantId, slideName) {
        dispatch(getMetadataForSlide(participantId, slideName));
    },
    handleError(error) {
        dispatch(sendMessageToBackend(error));
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(SlideViewer);