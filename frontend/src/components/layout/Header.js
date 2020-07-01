import React, {Component, Fragment} from "react";
import PropTypes from "prop-types";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {Link} from "react-router-dom";
import {connect} from "react-redux";
import {logout} from "../../redux/actions";


const Header = (props) => {

    const {isAuthenticated, user} = props.auth;

    //console.log(props);
    const authLink = (
        <Fragment>
            <span className="navbar-text ml-md-auto mr-2">{user ? `Welcome ${user.username}` : ''}</span>
            <button onClick={props.logout} className="btn btn-outline-light">Logout</button>
        </Fragment>
    );

    const guestLink = (
        <Fragment>
            <ul className="navbar-nav ml-md-auto">
                <li className="nav-item">
                    <Link to="/login" className="nav-link">
                        Sign in
                    </Link>
                </li>
            </ul>
            <Link className="btn btn-outline-light" to="/account/register">
                Sign up
            </Link>
        </Fragment>
    );
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container-xl d-lg-flex flex-items-center p-responsive">
                <a className="navbar-brand" href="#">
                    Projects Manager
                </a>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-toggle="collapse"
                    data-target="#navbarText"
                    aria-controls="navbarText"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarText">
                    <ul className="navbar-nav mr-auto">
                        <li className="nav-item active">
                            <a className="nav-link" href="#">
                                Tasks
                                <span className="sr-only">(current)</span>
                            </a>
                        </li>
                        <li className="nav-item">
                            <Link to="/project" className="nav-link">
                                Projects
                            </Link>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#">
                                Sprints
                            </a>
                        </li>
                    </ul>
                    {isAuthenticated ? authLink : guestLink}
                    {/*<AccountMenu />*/}
                </div>
            </div>
        </nav>
    );

};

Header.prototype = {
    auth: PropTypes.object.isRequired,
    logout: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
    auth: state.auth
});

export default connect(mapStateToProps, {logout})(Header);
