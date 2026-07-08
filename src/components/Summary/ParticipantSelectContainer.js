import { connect } from 'react-redux';
import ParticipantSelect from './ParticipantSelect';
import {
    getParticipantSlides as getParticipantSlidesAction,
    getAllParticipants as getAllParticipantsAction
} from '../../actions/Participants/participantActions';
import { withRouter } from 'react-router';

const mapStateToProps = (state, props) =>
    ({
        participants: state.participants
    });

const mapDispatchToProps = (dispatch, props) =>
    ({
        setSelectedParticipant(participant) {
            dispatch(getParticipantSlidesAction(participant, props));
        },
        getAllParticipants() {
            dispatch(getAllParticipantsAction());
        }
    });

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ParticipantSelect));