import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import TaskForm from './TaskForm';
import Paper from '@material-ui/core/Paper';
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import {makeStyles} from '@material-ui/core/styles';
import axios from 'axios';
import Loading from '../common/Loading';

TaskUpdate.propTypes = {};

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing(2),
        color: theme.palette.text.black,
    },
    formTitle: {
        textAlign: 'center',
    }
}));

function TaskUpdate(props) {

    const isNewTask = !props.match.params || !props.match.params.id;
    const classes = useStyles();
    const [task, setTask] = useState({});
    const [isLoaded, setIsLoaded] = useState(false);

    // https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous/Async_await
    useEffect(() => {
        let active = true;

        const fetchTask = async (id) => {
            try {
                const responseTask = await axios.get(`/api/tasks/${id}/`);
                const responseSprint = await axios.get(`/api/sprints/${responseTask.data.sprint}/`);
                const responseUser = await axios.get(`/api/auth/users/${responseTask.data.user}`);
                if (active) {
                    const newTask = {
                        ...responseTask.data,
                        sprint: responseSprint.data, user: responseUser.data
                    };
                    setTask(newTask);
                    setIsLoaded(true);
                }
            } catch (e) {
                console.log(e);
            }
        };

        if (!isNewTask) {
            const id = props.match.params.id;
            fetchTask(id);
        } else {
            setTask({});
        }

        return () => {
            active = false;
        }
    }, [isNewTask]);

    const handleCancel = () => {
        props.history.push("/task");
    };

    return (
        <>
            {!isNewTask && !isLoaded ?
                <Loading/> :
                <div className={classes.root}>
                    <Paper className={classes.paper} elevation={1}>
                        <Grid item container spacing={2}>
                            <Grid item xs={12}>
                                <Typography className={classes.formTitle} variant="h5" gutterBottom>
                                    {isNewTask ? "Creer une nouvelle " : "Editer la "} tache
                                </Typography>
                            </Grid>
                            <Grid item xs={12}>

                                <TaskForm
                                    isNewTask={isNewTask}
                                    task={task}
                                    handleCancel={handleCancel}/>

                            </Grid>
                        </Grid>
                    </Paper>
                </div>
            }
        </>
    );
}

export default TaskUpdate;