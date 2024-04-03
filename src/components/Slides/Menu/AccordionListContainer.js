import { connect } from 'react-redux';
import AccordionList from './AccordionList';
import { setSelectedSlide, setSelectedAccordion } from '../../../actions/Participants/participantActions';

const mapStateToProps = (state, props) =>
({
    selectedParticipant: state.selectedParticipant,
    participants: state.participants,
});

const mapDispatchToProps = (dispatch, props) =>
({
    setSelectedSlide(slide) {
        dispatch(setSelectedSlide(slide))
    },
    setSelectedAccordion(accordion){
        dispatch(setSelectedAccordion(accordion))
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(AccordionList);