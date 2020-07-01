import {makeStyles} from "@material-ui/core/styles";
import React, {useState} from "react";
import Grid from "@material-ui/core/Grid";
import ComboBoxUser from "./ComboBoxUser";
import ComboBoxClassification from "./ComboBoxClassification";
import IconButton from "@material-ui/core/IconButton";
import AddCircleIcon from '@material-ui/icons/AddCircle';
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';
import {useForm} from "react-hook-form";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField/TextField";
import {getMessageError} from "../../account/Login";
import Button from "@material-ui/core/Button";


let id = 0;

const useStyles = makeStyles((theme) => ({
    icon: {
        marginRight: theme.spacing(2),
    },
    heroButtons: {
        marginTop: theme.spacing(4),
    },
    cardGrid: {
        paddingTop: theme.spacing(2),
        paddingBottom: theme.spacing(8),
    },
    buttons: {
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
}));

// The following component is Input Component of the user
const UserInput = ({user, register, addUser, removeUser, errors, displayMinus}) => {
    const classes = useStyles();
    const id = user.user_id;
    console.log(id);
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
                        <AddCircleIcon fontSize="large"/>
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


const ProjectEditor = (props) => {

    const project = props.project;
    const classes = useStyles();
    const [users, setUsers] = useState([]);

    const [codeProject, setCodeProject] = useState('');
    const [designation, setDesignation] = useState('');
    const [objective, setObjective] = useState('');

    const {register, handleSubmit, errors, control, setValue} = useForm({
        mode: "onChange",
    });


    // initialize input fields
    React.useEffect(() => {
        console.log(project);
        id++;
        if (project.projectUsers && project.projectUsers.length > 0) {
            const projectUsers = project.projectUsers.map(user => ({
                user_id: id,
                username: user.username
            }));
            setUsers(projectUsers);
        } else {
            setUsers([{
                user_id: id
            }])
        }
        setCodeProject(project.code_project || '');
        setDesignation(project.designation || '');
        setObjective(project.objective || '');


    }, [project]);


    const addUser = () => {
        id++;
        const newUsers = users.concat({
            user_id: id
        });
        setUsers(newUsers);
    };

    const removeUser = (userId) => {
        const newUsers = users.filter(user => user.user_id !== userId);
        setUsers(newUsers);
    };


    const onSubmit = (data) => {
        console.log(data);
        const {code_project, designation, objective} = data;
        const projectUsers = users.map(id => {
            console.log(id);
            return {
                user_id: data[`user-${id}`],
                classification: data[`class-${id}`]
            };
        });
        const project = {
            code_project,
            designation,
            objective,
            projectUsers
        };
        console.log(project);
    };

    const handleSubmitForm = (e) => {
        e.preventDefault();
        const data = {
            code_project : codeProject,
            designation,
            objective
        };
        console.log(data);
    };

    return (
        <React.Fragment>
            <Typography variant="h4" gutterBottom>
                Create new project
            </Typography>
            <form onSubmit={handleSubmitForm} noValidate>
                <Grid container spacing={4}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            name="code_project"
                            required
                            value={codeProject}
                            onChange={event => setCodeProject(event.target.value)}
                            variant="outlined"
                            label="Code Project"
                            fullWidth
                            error={!!errors.code_project}
                            helperText={getMessageError(errors, "code_project")}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            variant="outlined"
                            value={designation}
                            onChange={event => setDesignation(event.target.value)}
                            name="designation"
                            label="Designation"
                            fullWidth
                            error={!!errors.designation}
                            helperText={getMessageError(errors, "designation")}
                            required
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            value={objective}
                            onChange={event => setObjective(event.target.value)}
                            multiline
                            rows={5}
                            required
                            variant="outlined"
                            name="objective"
                            label="Objective"
                            fullWidth
                            error={!!errors.objective}
                            helperText={getMessageError(errors, "objective")}
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
                        <Button type="submit" variant="contained" color="primary">
                            Save
                        </Button>
                        <Button onClick={props.cancel} variant="contained" color="secondary">
                            Back
                        </Button>
                    </div>
                </Grid>
            </form>
        </React.Fragment>
    );

};

export default ProjectEditor;