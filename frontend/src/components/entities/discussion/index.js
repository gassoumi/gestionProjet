import React from 'react';
import {Switch, Route} from 'react-router-dom';
import Discussion from './Discussion';
import DiscussionDetail from './DiscussionDetail';
import DiscussionUpdate from './DiscussionUpdate';

const Routes = ({match}) => (
    <>
        <Switch>
            <Route exact path={`${match.url}/create`} component={DiscussionUpdate}/>
            <Route exact path={`${match.url}/:id`} component={DiscussionDetail}/>
            <Route exact path={`${match.url}/:id/edit`} component={DiscussionUpdate}/>
            <Route excat path={match.url} component={Discussion}/>
        </Switch>
    </>
);

export default Routes;