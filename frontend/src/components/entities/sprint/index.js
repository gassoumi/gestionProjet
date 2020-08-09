import React from 'react';
import {Switch, Route} from 'react-router-dom';
import Sprint from './Sprint';

const Routes = ({match}) => (
    <>
        <Switch>
            <Route path={match.url} component={Sprint}/>
        </Switch>
    </>
);

export default Routes;