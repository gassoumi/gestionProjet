import React, {Component} from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "./components/layout/Header";
import {library} from "@fortawesome/fontawesome-svg-core";
import {fab} from "@fortawesome/free-brands-svg-icons";
import {
    faCheckSquare,
    faCoffee,
    fas,
} from "@fortawesome/free-solid-svg-icons";
import Routes from "./routes";
//import { BrowserRouter as Router } from "react-router-dom";
import {HashRouter as Router} from "react-router-dom";
import {Provider} from "react-redux";
import store from "./redux/store";
import {loadUser} from "./redux/actions";
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.min.css';
import Alerts from "./components/layout/Alerts";
import './styles.css';

library.add(fab, faCheckSquare, faCoffee, fas);

class App extends Component {
    componentDidMount() {
        console.log("the App component Did Mount ");
        store.dispatch(loadUser());
    }

    render() {
        return (
            <Provider store={store}>
                <Alerts/>
                <ToastContainer autoClose={2000}/>
                <Router>
                    <div>
                        <Routes/>
                    </div>
                </Router>
            </Provider>
        );
    }
}

export default App;
