import { connect } from 'react-redux';
import PatientSelect from './PatientSelect';
import { getPatientSlides, getAllPatientSlides } from '../../actions/Patients/patientActions';
import { withRouter } from 'react-router';

const mapStateToProps = (state, props) =>
    ({
        patients: state.patientSlides
    });

const mapDispatchToProps = (dispatch, props) =>
    ({
        setSelectedPatient(patient) {
            dispatch(getPatientSlides(patient, props));
        },
        getAllPatientSlides() {
            dispatch(getAllPatientSlides());
        }
    });

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(PatientSelect));