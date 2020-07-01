import React from "react";
import {Route, Switch, Redirect} from "react-router-dom";
import PrivateRoute from "./common/PrivateRoute";
import Entities from "./components/entities";
import Register from './components/account/Register';
import Login from './components/account/Login';

export default function Routes() {
    return (
        <Switch>
            <Route exact path="/account/register" component={Register}/>
            <Route exact path="/login" component={Login}/>
            <PrivateRoute path="/" component={Entities}/>
            <Redirect from="/" to="/project"/>
            <Redirect to="/project"/>
        </Switch>
    );
}
