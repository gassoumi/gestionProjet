import React from 'react';
import {Route, Redirect} from 'react-router-dom';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';


const PrivateRoute = ({component: Component, auth, ...rest}) => {

    // console.log(rest);
    // TODO 12
    // https://reactrouter.com/web/api/Redirect
    // use browser history to redirect the current url he needs when open a new page
    // auth.isAuthenticated is false when the user open new page or new tap
    // so it always redirect to the login page and then redirect to project component


    const from = rest.location ;

    return (<Route
            {...rest}
            render={(props) => {
                if (!auth.isAuthenticated) {
                    return <Redirect to={{
                        pathname: "/login",
                        // search: "?sort=name",
                        // hash: "#the-hash",
                        state: {from: from}
                    }}/>;
                } else {
                    return <Component {...props} />;
                }
            }}
        />
    );
};


const mapStateToProps = (state) => ({
    auth: state.auth,
});

export default connect(mapStateToProps)(PrivateRoute);