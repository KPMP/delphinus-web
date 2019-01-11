import { connect } from 'react-redux';
import PatientSelect from './PatientSelect';
import { getPatientSlides } from '../../actions/Patients/patientActions';
import { withRouter } from 'react-router';

const mapStateToProps = (state, props) =>
    ({
        patients: state.patients
    });

const mapDispatchToProps = (dispatch, props) =>
    ({
        setSelectedPatient(patient) {
            dispatch(getPatientSlides(patient, props));
        }
    });

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(PatientSelect));