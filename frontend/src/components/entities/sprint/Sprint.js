import React, {useEffect} from 'react';
import PropTypes from 'prop-types';
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import SaveIcon from "@material-ui/core/SvgIcon/SvgIcon";
import InputBase from "@material-ui/core/InputBase/InputBase";
import {fade, makeStyles} from "@material-ui/core/styles";
import SearchIcon from '@material-ui/icons/Search';
import CustomizedInputBase from '../common/CustomizedInputBase';
import AddIcon from '@material-ui/icons/Add';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';

import ReactTable from './ReactTable';
import {connect} from "react-redux";
import {Selector} from '../index';
import {fetchSprints, deleteSprintById} from "../../../redux/actions";


import SprintUpdate from './SprintUpdate';

import axios from 'axios';
import EnhancedTable from './EnhancedTable';
import SprintDeleteDialog from './SprintDeleteDialog';
import CircularProgress from '@material-ui/core/CircularProgress';
import CalendarSprint from './CalendarSprint';

//import BasicCalender2 from './BasicCalender2';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import FolderIcon from '@material-ui/icons/Folder';
import Paper from '@material-ui/core/Paper';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import {css} from "@emotion/core";
import ClipLoader from "react-spinners/ClipLoader";
import MoonLoader from "react-spinners/MoonLoader";
import Loading from '../common/Loading';


// Can be a string as well. Need to ensure each key-value pair ends with ;
// const override = css`
//   display: block;
//   margin: 0 auto;
//   border-color: red;
//   margin-top: 50%;
// `;

const override = css`
  margin: 0;
  position: absolute;
  top: 50%;
  left: 50%;
  border-color: red;
`;

const useStyles = makeStyles((theme) => ({
    search: {
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: fade(theme.palette.common.white, 0.15),
        '&:hover': {
            backgroundColor: fade(theme.palette.common.white, 0.25),
        },
        marginLeft: 0,
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing(1),
            width: 'auto',
        },
    },
    circularProgress: {
        display: 'flex',
        '& > * + *': {
            marginLeft: theme.spacing(2),
        },
    },
    searchIcon: {
        padding: theme.spacing(0, 2),
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    demo: {
        backgroundColor: theme.palette.background.paper,
    },
    inputRoot: {
        color: 'inherit',
    },
    inputInput: {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            width: '12ch',
            '&:focus': {
                width: '20ch',
            },
        },
    },
}));


function Sprint(props) {

    const classes = useStyles();

    const [open, setOpen] = React.useState(false);

    const [sprint, setSprint] = React.useState({});
    const [isNew, setIsNew] = React.useState(true);
    const [idSprint, setIdSprint] = React.useState(-1);
    // const [data, setData] = React.useState([]);
    // const [pageCount, setPageCount] = React.useState(0);
    // const [pageTable, setPageTable] = React.useState(0);

    const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
    const [sprintToDelete, setSprintToDelete] = React.useState({});

    const {
        pageSize, sprints, page, count, isFetching,
        fetchSprints, canEdit, deleteSprintById,
    } = props;

    const handleClickOpen = () => {
        setOpen(true);
    };

    const createNewSprint = () => {
        setSprint({});
        setIsNew(true);
        setIdSprint(-1);
        handleClickOpen();
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleCloseDeleteDialog = () => {
        setOpenDeleteDialog(false);
    };

    const handleEdit = idSprint => {
        setIsNew(false);
        setIdSprint(idSprint);
        /*
        axios.get(`/api/sprints/${idSprint}`)
            .then(response => {
                console.log(response.data);
                setSprint(response.data);
                handleClickOpen();
            })
            .catch(error => console.log(error));
         */
    };

    const handleDelete = sprint => {
        //deleteSprintById(sprint);
        setSprintToDelete(sprint);
        setOpenDeleteDialog(true);
    };

    useEffect(() => {
        fetchSprints(1, pageSize);
    }, []);

    useEffect(() => {
        let active = true;

        if (idSprint === -1) {
            return undefined;
        }

        axios.get(`/api/sprints/${idSprint}`)
            .then(response => {
                axios.get(`/api/projects/${response.data.project}/`)
                    .then(res => {
                        if (active) {
                            const sprint = {...response.data, project: res.data};
                            setSprint(sprint);
                            handleClickOpen();
                            setIdSprint(-1);
                        }
                    });
            })
            .catch(error => console.log(error));

        return () => {
            active = false;
        }
    }, [idSprint]);


    // useEffect(() => {
    //     if (sprints.length > 0) {
    //         //console.log(idStartRow);
    //         //const startRow = pageSize * (page - 1);
    //         // const endRow = startRow + pageSize;
    //         // console.log(startRow);
    //         // console.log(endRow);
    //         // console.log(sprints.slice(startRow, endRow));
    //
    //         setData(sprints);
    //         setPageTable(page - 1);
    //         setPageCount(Math.ceil(count / pageSize));
    //     }
    // }, [sprints]);


    return (
        <div>
            <SprintDeleteDialog
                sprint={sprintToDelete}
                open={openDeleteDialog}
                handleClose={handleCloseDeleteDialog}
                deleteSprintById={deleteSprintById}
            />
            <SprintUpdate
                fetchSprints={fetchSprints}
                isNew={isNew}
                sprint={sprint}
                open={open}
                handleClose={handleClose}/>
            <Grid container spacing={3}>
                <Grid item xs={12} container spacing={2}>
                    <Grid xs={6} item container justify={"flex-start"}>
                    </Grid>
                    <Grid xs={6} item container justify={"flex-end"}>
                        {canEdit &&
                        <Button startIcon={<AddCircleOutlineIcon/>}
                                onClick={createNewSprint}
                                type="button"
                                variant="contained"
                                color={"secondary"}
                        >
                            Ajouter un sprint
                        </Button>}

                    </Grid>
                </Grid>
                {isFetching ?
                    <>
                        {/*<div>Loading.....</div>*/}
                        <Loading/>
                        {/*<CircularProgress color="secondary"/>*/}
                    </>
                    : (
                        <>
                            < Grid container item xs={12} spacing={2}>
                                <EnhancedTable
                                    canEdit={canEdit}
                                    rows={sprints}
                                    count={count}
                                    handleEdit={handleEdit}
                                    handleDelete={handleDelete}
                                    fetchSprints={fetchSprints}
                                    page={page - 1}
                                    pageSize={pageSize}
                                />
                            </Grid>
                            <Grid container item xs={12} spacing={2}>
                                < Grid item xs={10}>
                                    <Paper elevation={1}>
                                        <CalendarSprint sprints={sprints}/>
                                    </Paper>
                                </Grid>
                                <Grid item xs={2}>
                                    <Paper elevation={1}>
                                        <List dense={true}>
                                            <ListItem>
                                                <ListItemIcon>
                                                    <FiberManualRecordIcon
                                                        style={{color: "#6c757d"}}/>
                                                </ListItemIcon>
                                                <ListItemText
                                                    primary="En cours"
                                                />
                                            </ListItem>
                                            <ListItem>
                                                <ListItemIcon>
                                                    <FiberManualRecordIcon
                                                        style={{color: "#28a745"}}/>
                                                </ListItemIcon>
                                                <ListItemText
                                                    primary="Planifié"
                                                />
                                            </ListItem>
                                            <ListItem>
                                                <ListItemIcon>
                                                    <FiberManualRecordIcon
                                                        style={{color: "#007bff"}}/>
                                                </ListItemIcon>
                                                <ListItemText
                                                    primary="Cloturé"
                                                />
                                            </ListItem>
                                            <ListItem>
                                                <ListItemIcon>
                                                    <FiberManualRecordIcon
                                                        style={{color: "#ffc107"}}/>
                                                </ListItemIcon>
                                                <ListItemText
                                                    primary="Archivé"
                                                />
                                            </ListItem>
                                        </List>
                                    </Paper>
                                </Grid>
                            </Grid>
                            {/*< Grid container item xs={12} spacing={1}>*/}
                            {/*    <BasicCalender/>*/}
                            {/*</Grid>*/}

                        </>
                    )
                }
                {/*<Grid container item xs={12} spacing={2}>*/}
                {/*    <ReactTable*/}
                {/*        handleEdit={handleEdit}*/}
                {/*        handleDelete={handleDelete}*/}
                {/*    />*/}
                {/*</Grid>*/}
                {/*<Grid container item xs={12} spacing={2}>*/}
                {/*    <EnhancedTable/>*/}
                {/*</Grid>*/}
                {/*<Grid item xs={12}>*/}
                {/*    <SprintList fetchSprints={props.fetchSprints} currentPage={props.page} count={props.count}*/}
                {/*                sprints={props.sprints}/>*/}
                {/*</Grid>*/}
                {/*<Grid item xs={12}>*/}
                {/*    <ReactTablePaginationServer/>*/}
                {/*</Grid>*/}


            </Grid>
        </div>
    );
}

Sprint.propTypes = {};

const mapStateToProps = (state) => {
    const {
        pagination: {sprint},
    } = state;
    //const listProjectIds = project.ids || [];
    const listSprint = Selector.getSprintsPage(state);

    return {
        sprints: listSprint || [],
        nextPageUrl: sprint.nextPageUrl,
        page: sprint.page,
        isFetching: sprint.isFetching,
        canEdit: state.auth.user.is_staff || false,
        count: sprint.count,
        pageSize: sprint.pageSize,
    };
};

export default connect(mapStateToProps, {fetchSprints, deleteSprintById})(Sprint);
