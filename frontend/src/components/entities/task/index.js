import React from 'react';
import {Switch, Route} from 'react-router-dom';
import Task from './Task';
import TaskUpdate from './TaskUpdate'


const Routes = ({match}) => (
    <>
        <Switch>
            <Route exact path={`${match.url}/create`} component={TaskUpdate}/>
            <Route exact path={`${match.url}/:id/edit`} component={TaskUpdate}/>
            <Route path={match.url} component={Task}/>
        </Switch>
    </>
);

export default Routes;