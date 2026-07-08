import { connect } from 'react-redux';
import SlideList from './SlideList';
import { setSelectedSlide, getParticipantSlidesMetadata } from '../../../actions/Participants/participantActions';
import { setSelectedAccordion , setSelectedMetadata} from '../../../actions/Participants/participantActions';

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
  },
    setSelectedMetadata(metadata){
        dispatch(setSelectedMetadata(metadata))
    },
    getParticipantSlidesMetadata(participantId, slideName, slide) {
        dispatch(getParticipantSlidesMetadata(participantId, slideName, slide))
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(SlideList);