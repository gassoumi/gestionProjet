import React from 'react';
import {Switch, Route} from 'react-router-dom';
import Project from './Project';
import ProjectDetail from './ProjectDetail';
import ProjectUpdate from './ProjectUpdate';

const Routes = ({match}) => (
    <>
        <Switch>
            <Route exact path={`${match.url}/create`} component={ProjectUpdate}/>
            <Route exact path={`${match.url}/:id`} component={ProjectDetail}/>
            <Route exact path={`${match.url}/:id/edit`} component={ProjectUpdate}/>
            <Route path={match.url} component={Project}/>
        </Switch>
    </>
);

export default Routes;