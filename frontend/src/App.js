import React, {Component} from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {library} from "@fortawesome/fontawesome-svg-core";
import {fab} from "@fortawesome/free-brands-svg-icons";
import {
    faCheckSquare,
    faCoffee,
    fas,
} from "@fortawesome/free-solid-svg-icons";
import Routes from "./routes";
import LoadingBar from 'react-redux-loading-bar'
//import { BrowserRouter as Router } from "react-router-dom";
import {HashRouter as Router} from "react-router-dom";
import {Provider} from "react-redux";
import store from "./redux/store";
import {loadUser} from "./redux/actions";
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.min.css';
import Alerts from "./components/layout/Alerts";
import './styles.css';
import setupAxios from './utils/axiosInterceptors';
import moment from 'moment';
import {bindActionCreators} from 'redux';
import {LOGOUT_SUCCESS} from "./redux/actionTypes";

// https://stackoverflow.com/questions/52946376/reactjs-axios-interceptors-how-dispatch-a-logout-action

moment.locale('fr');
library.add(fab, faCheckSquare, faCoffee, fas);

// cleat token when it became invalid
const clearAuthentication = (messageKey) => (dispatch, getState) => {
    //dispatch(displayAuthError(messageKey));
    //console.log("clearAuthentication is called ",messageKey);
    return dispatch({
        type: LOGOUT_SUCCESS,
    });
};

const actions = bindActionCreators({clearAuthentication}, store.dispatch);

setupAxios(store.dispatch,
    () => actions.clearAuthentication('login.error.unauthorized'));

class App extends Component {
    componentDidMount() {
        // console.log("the App component Did Mount ");
        store.dispatch(loadUser());
    }

    render() {
        return (
            <Provider store={store}>
                <Alerts/>
                <ToastContainer autoClose={2000}/>
                <Router>
                    <LoadingBar updateTime={100} maxProgress={95} progressIncrease={10} showFastActions
                                style={{backgroundColor: 'blue', height: '5px'}}/>
                    <div>
                        <Routes/>
                    </div>
                </Router>
            </Provider>
        );
    }
}

export default App;
