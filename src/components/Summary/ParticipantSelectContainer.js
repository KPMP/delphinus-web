import { connect } from 'react-redux';
import ParticipantSelect from './ParticipantSelect';
import { getParticipantSlides, getAllParticipants } from '../../actions/Participants/participantActions';
import { withRouter } from 'react-router';

const mapStateToProps = (state, props) =>
    ({
        participants: state.participants
    });

const mapDispatchToProps = (dispatch, props) =>
    ({
        setSelectedParticipant(participant) {
            dispatch(getParticipantSlides(participant, props));
        },
        getAllParticipants() {
            dispatch(getAllParticipants());
        }
    });

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ParticipantSelect));