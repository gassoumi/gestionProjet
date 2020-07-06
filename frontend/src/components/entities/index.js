import React from 'react';
import {Switch, Route, HashRouter as Router, Redirect} from 'react-router-dom';
import Project from './project';
import Sidebar from '../layout/Sidebar'
import CssBaseline from "@material-ui/core/CssBaseline/CssBaseline";
import MyHeader from "../layout/MyHeader";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import {makeStyles} from "@material-ui/core/styles";
import {tokenConfig} from "../../utils";
import {returnErrors} from "../../redux/actions/messages";
import * as Selector from "../../redux/selectors";


const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
    },
}));

// add all entities here
const Routes = (props) => {
    const {match} = props;
    const classes = useStyles();
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
                        <Redirect to="/project"/>
                    </Switch>
                </main>
            </div>
        </>
    );
};

export { tokenConfig, returnErrors, Selector}


export default Routes;
