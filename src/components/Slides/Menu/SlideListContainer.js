import { connect } from 'react-redux';
import SlideList from './SlideList';
import { setSelectedSlide } from '../../../actions/Participants/participantActions';

const mapStateToProps = (state, props) =>
    ({
        selectedParticipant: state.selectedParticipant
    });

const mapDispatchToProps = (dispatch, props) =>
    ({
        setSelectedSlide(slide) {
            dispatch(setSelectedSlide(slide))
        }
    });

export default connect(mapStateToProps, mapDispatchToProps)(SlideList);