import { connect } from 'react-redux';
import SlideList from './SlideList';
import { setSelectedSlide } from '../../../actions/Participants/participantActions';
import { setSelectedAccordion } from '../../../actions/Participants/participantActions';

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

export default connect(mapStateToProps, mapDispatchToProps)(SlideList);