import { connect } from 'react-redux';
import SlideList from './SlideList';
import {
    setSelectedSlide as setSelectedSlideAction,
    getParticipantSlidesMetadata as getParticipantSlidesMetadataAction,
    setSelectedAccordion as setSelectedAccordionAction,
    setSelectedMetadata as setSelectedMetadataAction
} from '../../../actions/Participants/participantActions';

const mapStateToProps = (state, props) =>
({
    selectedParticipant: state.selectedParticipant,
    participants: state.participants,
});

const mapDispatchToProps = (dispatch, props) =>
({
    setSelectedSlide(slide) {
        dispatch(setSelectedSlideAction(slide))
    },
    setSelectedAccordion(accordion){
      dispatch(setSelectedAccordionAction(accordion))
  },
    setSelectedMetadata(metadata){
        dispatch(setSelectedMetadataAction(metadata))
    },
    getParticipantSlidesMetadata(participantId, slideName, slide) {
        dispatch(getParticipantSlidesMetadataAction(participantId, slideName, slide))
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(SlideList);