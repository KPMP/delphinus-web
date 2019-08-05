import Api from '../../helpers/Api';

const api = Api.getInstance();

export const handleError = () => {
    return (dispatch) => {
        window.location.href = "/oops";
    }
};

export const sendMessageToBackend = (error) => {
	let errorMessage = { error: error.message , stackTrace: error.stack }
	return (dispatch) => {
		dispatch(handleError());
		api.post('/api/v1/error', errorMessage);
	};
}
