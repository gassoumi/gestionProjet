import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import Grid from "@material-ui/core/Grid";


import {Selector} from "../index";
import {connect} from "react-redux";
import {fetchTasks, deleteTaskById} from "../../../redux";
import TaskTable from './TaskTable';
import Loading from '../common/Loading';
import {Link as RouterLink} from 'react-router-dom';
import Button from "@material-ui/core/Button";
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import DeleteDialog from '../common/DeleteDialog';

// TODO file plugin
// https://github.com/react-dropzone/react-dropzone/
// plugins
// https://falcon.technext.it/plugins/plyr

// https://stackoverflow.com/questions/53464595/how-to-use-componentwillmount-in-react-hooks

function Task(props) {

    const {
        canEdit, tasks, count,
        fetchTasks, isFetching, pageSize, page, deleteTaskById, updateSuccess,
    } = props;

    const [open, setOpen] = useState(false);
    const [task, setTask] = useState({});
    const [isMount, setIsMount] = useState(false);


    useEffect(() => {
        // After delete success we fetch data again
        // here we use updateSuccess for delete
        if (!isMount || updateSuccess) {
            fetchTasks();
        }
        setIsMount(true);
    }, [updateSuccess]);


    const handleEdit = (id) => {
        props.history.push(`task/${id}/edit`);
    };

    const handleDelete = (task) => {
        setTask(task);
        setOpen(true);
    };

    const createNew = () => {
        props.history.push("/task/create");
    };

    return (
        <>
            <Grid container spacing={3}>
                <DeleteDialog
                    open={open}
                    object={task}
                    handleClose={() => setOpen(false)}
                    deleteObject={deleteTaskById}
                >
                    Are you sure you want to delete the Task {task.description} ?
                </DeleteDialog>
                <Grid item xs={12} container spacing={2}>
                    <Grid xs={6} item container justify={"flex-start"}>
                    </Grid>
                    <Grid xs={6} item container justify={"flex-end"}>
                        {canEdit &&
                        <>
                            {/*<Button startIcon={<AddCircleOutlineIcon/>}*/}
                            {/*    // onClick={createNewTask}*/}
                            {/*        type="button"*/}
                            {/*        variant="contained"*/}
                            {/*        color={"secondary"}*/}
                            {/*        component={RouterLink}*/}
                            {/*        to="/task/create"*/}
                            {/*>*/}
                            {/*    Ajouter une tache*/}
                            {/*</Button>*/}
                            <Button startIcon={<AddCircleOutlineIcon/>}
                                    onClick={createNew}
                                    type="button"
                                    variant="contained"
                                    color={"secondary"}
                            >
                                Ajouter une tache
                            </Button>
                        </>
                        }

                    </Grid>
                </Grid>
                {isFetching ?
                    <Loading/>
                    :
                    (
                        < Grid container item xs={12} spacing={2}>
                            <TaskTable
                                rows={tasks}
                                count={count}
                                handleEdit={handleEdit}
                                handleDelete={handleDelete}
                                fetchTasks={fetchTasks}
                                page={page - 1}
                                pageSize={pageSize}
                            />
                        </Grid>
                    )
                }
            </Grid>
        </>
    );
}

Task.propTypes = {};

const mapStateToProps = (state) => {
    const {
        pagination: {task},
    } = state;
    const listTask = Selector.getTasksPage(state);

    return {
        tasks: listTask || [],
        nextPageUrl: task.nextPageUrl,
        page: task.page,
        isFetching: task.isFetching,
        canEdit: state.auth.user.is_staff || false,
        count: task.count,
        pageSize: task.pageSize,
        updateSuccess: task.updateSuccess,
    };
};

export default connect(mapStateToProps, {fetchTasks, deleteTaskById})(Task);

