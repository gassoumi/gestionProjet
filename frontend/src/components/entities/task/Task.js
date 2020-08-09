import React, {useEffect} from 'react';
import PropTypes from 'prop-types';
import Grid from "@material-ui/core/Grid";

import AddIcon from '@material-ui/icons/Add';
import {Selector} from "../index";
import {connect} from "react-redux";
import {fetchTasks} from "../../../redux";
import TaskTable from './TaskTable';
import Loading from '../common/Loading';
import {Link as RouterLink} from 'react-router-dom';
import Button from "@material-ui/core/Button";
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';

// TODO file plugin
// https://github.com/react-dropzone/react-dropzone/
// plugins
// https://falcon.technext.it/plugins/plyr
function Task(props) {

    const {
        canEdit, tasks, count,
        fetchTasks, isFetching, pageSize, page
    } = props;


    useEffect(() => {
        fetchTasks();
    }, []);

    const handleEdit = (id) => {
        props.history.push(`task/${id}/edit`);
    };

    const handleDelete = () => {

    };

    const createNew = () => {
        props.history.push("/task/create");
    };

    return (
        <>
            <Grid container spacing={3}>
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
                    <>
                        {/*    <Grid container justify="center">*/}
                        {/*        <div>Loading.....</div>*/}
                        {/*    <CircularProgress color="secondary"/>*/}
                        {/*</Grid>*/}
                        <Loading/>
                    </>
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
    //const listProjectIds = project.ids || [];
    const listTask = Selector.getTasksPage(state);

    return {
        tasks: listTask || [],
        nextPageUrl: task.nextPageUrl,
        page: task.page,
        isFetching: task.isFetching,
        canEdit: state.auth.user.is_staff || false,
        count: task.count,
        pageSize: task.pageSize,
    };
};

export default connect(mapStateToProps, {fetchTasks})(Task);

