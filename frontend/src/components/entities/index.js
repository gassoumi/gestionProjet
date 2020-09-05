import React from 'react';
import {Switch, Route, HashRouter as Router, Redirect} from 'react-router-dom';
import Project from './project';
import Sprint from './sprint';
import Task from './task';
import Document from './document';
import Sidebar from '../layout/Sidebar'
import CssBaseline from "@material-ui/core/CssBaseline";
import MyHeader from "../layout/MyHeader";
import Toolbar from "@material-ui/core/Toolbar";
import {makeStyles} from "@material-ui/core/styles";
import {tokenConfig} from "../../utils";
import {returnErrors} from "../../redux/actions/messages";
import * as Selector from "../../redux/selectors";
import Discussion from './discussion';


const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(4),
    },
}));

// add all entities here
const Routes = (props) => {
    const {match} = props;
    const classes = useStyles();
    //console.log(match.url); // equal "/"
    return (
        <>
            <div className={classes.root}>
                <CssBaseline/>
                <MyHeader/>
                <Sidebar/>
                <main className={classes.content}>
                    <Toolbar id="back-to-top-anchor"/>
                    <Switch>
                        <Route path={`${match.url}project`} component={Project}/>
                        <Route path={`${match.url}sprint`} component={Sprint}/>
                        <Route path={`${match.url}task`} component={Task}/>
                        <Route path={`${match.url}document`} component={Document}/>
                        <Route path={`${match.url}discussion`} component={Discussion}/>
                        <Redirect to="/project"/>
                    </Switch>
                </main>
            </div>
        </>
    );
};

export {tokenConfig, returnErrors, Selector}


export default Routes;
