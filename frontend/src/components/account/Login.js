import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import {makeStyles} from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import {connect} from "react-redux";
import {login} from "../../redux/actions";
import {useForm} from "react-hook-form";
import {Link as RouterLink, Redirect} from "react-router-dom";
import CachedIcon from '@material-ui/icons/Cached';
import Loader from 'react-loader-spinner';
import Loading from './Loading';


// Messages
const requiredField = "This field is required";
const maxLengthField = "Your input exceed maximum length";
const passwordNotMatch = "Passwords do not match!";
const invalidEmail = "Invalid Email";

export const getMessageError = (errors, name,) => {
    if (errors && errors[name] && errors[name].type === "required") {
        return requiredField
    } else if (errors && errors[name] && errors[name].type === "maxLength") {
        return maxLengthField
    } else if (errors && errors[name] && errors[name].type === "pattern") {
        return invalidEmail;
    } else if (errors && errors[name] && errors[name].type === "passwordEqual") {
        return passwordNotMatch;
    }
};

function Copyright() {
    return (
        <Typography variant="body2" color="textSecondary" align="center">
            {'Copyright © '}
            <Link color="inherit" href="https://material-ui.com/">
                Your Website
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));

function Login(props) {

    // TODO 1 create a custom loading component later
    // TODO 2 change redirect to the url from the text field of url of the browser

    if (props.auth.isAuthenticated) {
        return <Redirect to="/project"/>;
    } else if (props.auth.isLoading) {
        return (
            <>
            {/*<div*/}
            {/*    style={{*/}
            {/*        width: "100%",*/}
            {/*        height: "100%",*/}
            {/*        display: "flex",*/}
            {/*        justifyContent: "center",*/}
            {/*        alignItems: "center",*/}
            {/*    }}*/}
            {/*>*/}
            {/*    <Loader timeout={5000} type="Circles"  height="100" width="100"/></div>*/}
            <Loading/>
            </>
        );
    }


    const classes = useStyles();
    const {register, handleSubmit, errors} = useForm();

    const onSubmit = (data) => {
        const {username, password} = data;
        props.login(username, password);
    };


    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline/>
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon/>
                </Avatar>
                <Typography component="h1" variant="h5">
                    Sign in
                </Typography>
                <form onSubmit={handleSubmit(onSubmit)} className={classes.form} noValidate>
                    <TextField
                        required
                        inputRef={register({required: true, maxLength: 50})}
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        label="Username"
                        name="username"
                        autoComplete="username"
                        autoFocus
                        error={!!errors.username}
                        helperText={getMessageError(errors, "username")}
                    />
                    <TextField
                        required
                        inputRef={register({required: true})}
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        autoComplete="current-password"
                        error={!!errors.password}
                        helperText={getMessageError(errors, "password")}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                    >
                        Sign In
                    </Button>
                </form>
            </div>
            <Box mt={8}>
                <Copyright/>
            </Box>
        </Container>
    );
}

const mapStateToProps = (state) => ({
    auth: state.auth,
});

export default connect(mapStateToProps, {login})(Login);
