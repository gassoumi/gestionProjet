import {makeStyles} from "@material-ui/core/styles";
import React, {useState, useEffect} from "react";
import Grid from "@material-ui/core/Grid";
import ComboBoxUser from "./ComboBoxUser";
import ComboBoxClassification from "./ComboBoxClassification";
import IconButton from "@material-ui/core/IconButton";
import AddCircleIcon from '@material-ui/icons/AddCircle';
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';
import {useForm, Controller} from "react-hook-form";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField/TextField";
import {getMessageError} from "../../account/Login";
import Button from "@material-ui/core/Button";
import SaveIcon from '@material-ui/icons/Save';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import Paper from '@material-ui/core/Paper';
import {createProject, updateProject} from "../../../redux/actions/project";
import {connect} from "react-redux";
import {green} from '@material-ui/core/colors';


let id = 0;

const useStyles = makeStyles((theme) => ({
    icon: {
        marginRight: theme.spacing(2),
    },
    heroButtons: {
        marginTop: theme.spacing(4),
    },
    form: {
        marginTop: theme.spacing(3),
    },
    cardGrid: {
        paddingTop: theme.spacing(2),
        paddingBottom: theme.spacing(8),
    },
    button: {
        '& > *': {
            margin: theme.spacing(1),
        },
    },
    card: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
    },
    cardMedia: {
        paddingTop: '56.25%', // 16:9
    },
    cardContent: {
        flexGrow: 1,
    },
    buttons: {
        marginTop: theme.spacing(3),
        marginLeft: theme.spacing(1),
        '& > *': {
            margin: theme.spacing(1),
        },
    },
    paper: {
        marginTop: theme.spacing(3),
        marginBottom: theme.spacing(3),
        padding: theme.spacing(2),
        [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
            marginTop: theme.spacing(1),
            marginBottom: theme.spacing(6),
            padding: theme.spacing(3),
        },
    },
}));

const defaultValue = {
    code_project: "",
    designation: "",
    objective: ""
};


// The following component is Input Component of the user
const UserInput = ({user, register, addUser, removeUser, errors, displayMinus}) => {
    const classes = useStyles();
    const userName = `user-${user.user_id}`;
    const classificationName = `class-${user.user_id}`;
    const defaultUsername = user.username || null;
    const defaultClassification = user.classification || null;

    return (
        <React.Fragment>
            <Grid container item xs={12} spacing={2}>
                <Grid item xs={12} sm={5}>
                    <ComboBoxUser defaultValue={defaultUsername} register={register} name={userName} errors={errors}/>
                </Grid>
                <Grid item xs={12} sm={5}>
                    <ComboBoxClassification defaultValue={defaultClassification} register={register} errors={errors}
                                            name={classificationName}/>
                </Grid>
                <Grid item sm={2}>
                    <IconButton type="button" onClick={addUser} aria-label="add">
                        <AddCircleIcon style={{color: green[500]}} fontSize="large"/>
                    </IconButton>
                    {displayMinus &&
                    <IconButton color="secondary" type="button" onClick={() => removeUser(user.user_id)}
                                aria-label="remove">
                        <RemoveCircleIcon fontSize="large"/>
                    </IconButton>
                    }
                </Grid>
            </Grid>
        </React.Fragment>
    )
};

const ProjectEditor = ({project, isNew, createProject, updateProject, cancel, updateSuccess}) => {

    const classes = useStyles();
    const [users, setUsers] = useState([]);

    const {register, handleSubmit, errors, control, reset} = useForm({
        mode: "onChange",
    });

    // initialize input fields
    useEffect(() => {
        console.log(project);
        console.log(isNew);
        if (!isNew) {
            // if we have users for this project
            if (project.projectUsers && project.projectUsers.length > 0) {
                const projectUsers = project.projectUsers.map(user => ({
                    user_id: id++,
                    username: user.username,
                    classification: user.classification
                }));
                setUsers(projectUsers);
            } else {
                // this project doesn't have users yet ,we create one userInput for this project
                setUsers([{
                    user_id: id++,
                    username: "",
                    classification: ""
                }]);
            }
            // set the value for the input fields
            reset({
                code_project: project.code_project,
                designation: project.designation,
                objective: project.objective
            });
        } else {
            setUsers([{
                user_id: id++,
                username: "",
                classification: ""
            }]);
            reset(defaultValue);
        }

    }, [project, isNew]);

    useEffect(() => {
        if (updateSuccess) {
            cancel();
        }
    }, [updateSuccess]);


    const addUser = () => {
        const newUsers = users.concat({
            user_id: id++
        });
        setUsers(newUsers);
    };

    const removeUser = (userId) => {
        const newUsers = users.filter(user => user.user_id !== userId);
        setUsers(newUsers);
    };


    const onSubmit = (data) => {
        const {code_project, designation, objective} = data;
        const projectUsers = users.map(user => {
            const username = data[`user-${user.user_id}`];
            const classification = data[`class-${user.user_id}`];
            if (username && classification) {
                return {
                    username,
                    classification
                };
            }
        }).filter(project => project != null);
        const project = {
            code_project,
            designation,
            objective,
            projectUsers
        };
        console.log(project);
        console.log(isNew);
        if (isNew) {
            createProject(project)
        } else {
            updateProject(project.code_project, project);
        }
    };


    return (
        <Grid item xs={10}>
            <Paper className={classes.paper}>
                <React.Fragment>
                    <Typography variant="h5" gutterBottom>
                        {isNew ? "Create new" : "Edit "} project
                    </Typography>
                    <form className={classes.form} onSubmit={handleSubmit(onSubmit)} noValidate>
                        <Grid container spacing={4}>
                            <Grid item xs={12} sm={6}>
                                <Controller
                                    as={<TextField
                                        required
                                        variant="outlined"
                                        label="Code Project"
                                        fullWidth
                                        error={!!errors.code_project}
                                        helperText={getMessageError(errors, "code_project")}
                                        disabled={!isNew}
                                    />}
                                    rules={{required: true, maxLength: 200}}
                                    name="code_project"
                                    control={control}
                                    defaultValue=""

                                />

                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Controller
                                    name="designation"
                                    control={control}
                                    defaultValue=""
                                    rules={{required: true, maxLength: 100}}
                                    as={<TextField
                                        variant="outlined"
                                        label="Designation"
                                        fullWidth
                                        error={!!errors.designation}
                                        helperText={getMessageError(errors, "designation")}
                                        required
                                    />}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Controller
                                    defaultValue=""
                                    rules={{required: true}}
                                    control={control}
                                    name="objective"
                                    as={<TextField
                                        multiline
                                        rows={5}
                                        required
                                        variant="outlined"
                                        label="Objective"
                                        fullWidth
                                        error={!!errors.objective}
                                        helperText={getMessageError(errors, "objective")}
                                    />}
                                />
                            </Grid>
                            <Grid container justify="center" item xs={12}>
                                <Typography variant="h5" gutterBottom>
                                    Team Scrum
                                </Typography>
                            </Grid>
                        </Grid>
                        <Grid item xs={12}>
                            {users.map((user, index) => (
                                    <UserInput key={user.user_id} user={user} addUser={addUser}
                                               removeUser={removeUser}
                                               displayMinus={index !== 0}
                                               register={register} errors={errors} required/>
                                )
                            )}
                        </Grid>
                        <Grid item xs={12}>
                            <div className={classes.buttons}>
                                <Button startIcon={<SaveIcon/>} type="submit" variant="contained" color="primary">
                                    Save
                                </Button>
                                <Button startIcon={<ArrowBackIcon/>} onClick={cancel} variant="contained"
                                        color="secondary">
                                    Back
                                </Button>
                            </div>
                        </Grid>
                    </form>
                </React.Fragment>
            </Paper>
        </Grid>
    );

};

const mapStateToProps = state => ({
    updateSuccess: state.pagination.project.updateSuccess
});

export default connect(mapStateToProps, {createProject, updateProject})(ProjectEditor);