import { connect } from 'react-redux';
import AccordionList from './AccordionList';
import { setSelectedSlide } from '../../../actions/Participants/participantActions';

const mapStateToProps = (state, props) =>
({
    selectedParticipant: state.selectedParticipant,
    participants: state.participants,
});

const mapDispatchToProps = (dispatch, props) =>
({
    setSelectedSlide(slide) {
        dispatch(setSelectedSlide(slide))
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(AccordionList);