import React from 'react';
import {Switch, Route} from 'react-router-dom';
import Document from './Document';
import DocumentDetail from './DocumentDetail';
import DocumentUpdate from './DocumentUpdate';

const Routes = ({match}) => (
    <>
        <Switch>
            <Route exact path={`${match.url}/create`} component={DocumentUpdate}/>
            <Route exact path={`${match.url}/:id`} component={DocumentDetail}/>
            <Route exact path={`${match.url}/:id/edit`} component={DocumentUpdate}/>
            <Route excat path={match.url} component={Document}/>
        </Switch>
    </>
);

export default Routes;