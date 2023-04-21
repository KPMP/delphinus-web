import React, { Component } from 'react';
import NavBar from './components/Nav/NavBar';
import Summary from './components/Summary/Summary';
import Slides from './components/Slides/Slides';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import loadedState from './initialState';
import rootReducer from './reducers';
import { Router, Route, Switch } from 'react-router-dom';
import ReactGA from 'react-ga4';
import createHistory from 'history/createBrowserHistory';
import Oops from './components/Error/Oops';
import ErrorBoundaryContainer from './components/Error/ErrorBoundaryContainer';
import PermissionDenied from './components/Error/PermissionDenied';
import NotRegistered from './components/Error/NotRegistered';
import NotFoundPage from './components/Error/NotFoundPage.js';

const cacheStore = window.sessionStorage.getItem('dpr');
const initialState = cacheStore ?
    JSON.parse(cacheStore) :
    loadedState;
const store = applyMiddleware(thunk)(createStore)(rootReducer, initialState, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());
const saveState = () => {
    window.sessionStorage.setItem('dpr', JSON.stringify(store.getState()));
};
const GA_TRACKING_ID = 'UA-124331187-9';

ReactGA.initialize(GA_TRACKING_ID);
function logPageView(location, action) {
	ReactGA.send({hitType: 'pageview', page: location.pathname + location.search})
}
const history = createHistory();
history.listen((location, action) => {
    logPageView(location, action);
});

store.subscribe(function () {
    console.log(store.getState())
});

store.subscribe(saveState);

class App extends Component {

    componentWillMount() {
        logPageView(window.location, '');
    }

    render() {
    	return (
    		<Provider store={store}>
				<Router history={history}>
					<ErrorBoundaryContainer>
						<NavBar/>
						<Switch>
							<Route exact path='/slides' component={Slides}/>
							<Route exact path='/oops' component={Oops} />
							<Route exact path='/notRegistered' component={NotRegistered} />
							<Route exact path='/permissionDenied' component={PermissionDenied} />
							<Route exact path='/' component={Summary}/>
							<Route path='/*' component={NotFoundPage} />
						</Switch>
					</ErrorBoundaryContainer>
				</Router>
    		</Provider>
        );
    }
}

export default App;
