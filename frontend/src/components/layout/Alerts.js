import React, {Component} from 'react';
import {toast} from 'react-toastify';
import {connect} from "react-redux";
import PropTypes from 'prop-types';

class Alerts extends Component {

    componentDidUpdate(prevProps, prevState, snapshot) {
        const {error, message} = this.props;
        if (prevProps.error !== error) {
            if (error.msg.name) {
                toast.error(`Name : ${error.msg.name.join()}`);
            }
            if (error.msg.email) {
                toast.error(`Email : ${error.msg.email.join()}`);
            }
            if (error.msg.message) {
                toast.error(`Email : ${error.msg.message.join()}`);
            }
            if (error.msg.username) {
                toast.error(error.msg.username.join());
            }
            if (error.msg.non_field_errors) {
                toast.error(error.msg.non_field_errors.join());
            }
            if (error.msg.detail) {
                toast.error(error.msg.detail);
            }
        }
        if (message !== prevProps.message) {
            if (message.passwordNotMatch) {
                toast.error(message.passwordNotMatch);
            }
        }

    }

    render() {
        return (
            <React.Fragment/>
        );
    }
}

Alerts.propTypes = {};

const mapStateToProps = (state) => ({
    error: state.errors,
    message: state.messages
});

export default connect(mapStateToProps)(Alerts);
