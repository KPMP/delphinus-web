import { connect } from 'react-redux';
import SlideViewer from './SlideViewer';
import { sendMessageToBackend } from '../../actions/Error/errorActions';

const mapStateToProps = (state, props) =>
({
    selectedParticipant: state.selectedParticipant
});

const mapDispatchToProps = (dispatch, props) =>
({
    handleError(error) {
        dispatch(sendMessageToBackend(error));
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(SlideViewer);