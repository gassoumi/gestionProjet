import React, {useEffect} from "react";
import {connect} from "react-redux";
import PropTypes from "prop-types";
import {fetchProjects} from "../../../redux";
import ProjectItem from "./ProjectItem";
import InfiniteScroll from 'react-infinite-scroller';
import {makeStyles} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import {Selector} from '../index';
import CircularProgress from '@material-ui/core/CircularProgress';
import CssBaseline from '@material-ui/core/CssBaseline';
import Loading from '../common/Loading';

const useStyles = makeStyles((theme) => ({
    cardGrid: {
        paddingTop: theme.spacing(2),
        paddingBottom: theme.spacing(8),
    },
    root: {
        width: '100%',
    },
    card: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
    },
    cardContent: {
        flexGrow: 1,
    },
    infinityScroll: {
        height: '700px',
        overflow: 'auto'
    },
    loader: {
        marginTop: theme.spacing(5),
        position: 'absolute',
        textAlign: 'center',
        width: '100px',
        height: '100px',
        display: 'inline-block',
        left: '50%'
    },
}));


function Project(props) {

    const classes = useStyles();

    const {nextPageUrl} = props;
    const hasMoreItems = nextPageUrl !== null;

    useEffect(() => {
        props.fetchProjects()
    }, []);


    const loadMore = () => {
        const hasMoreItems = nextPageUrl !== null;
        if (hasMoreItems && !props.isFetching) {
            props.fetchProjects(props.page + 1);
        }
    };

    return (
        <Grid className={classes.cardGrid} container spacing={2}>
            <CssBaseline/>
            <InfiniteScroll
                className={classes.root}
                loadMore={loadMore}
                hasMore={hasMoreItems}
                // loader={<Loading key={props.page}/>}
                loader={<CircularProgress className={classes.loader} size={30} key={props.page}/>}
            >
                <Grid container item xs={12} spacing={3}>
                    {props.projects.map((project, index, array) => (
                        <ProjectItem project={project} canEdit={props.canEdit} length={array.length}
                                     key={project.code_project}/>
                    ))}
                </Grid>
            </InfiniteScroll>
        </Grid>
    );
}


const mapStateToProps = (state) => {

    /*
    const {
        entities: {projects},
        pagination: {project},
    } = state;
     */
    const {
        pagination: {project},
    } = state;
    //const listProjectIds = project.ids || [];
    const listProject = Selector.getProjects(state);


    return {
        projects: listProject || [],
        nextPageUrl: project.nextPageUrl,
        page: project.page,
        isFetching: project.isFetching,
        canEdit: state.auth.user.is_staff || false
    };
};

Project.prototype = {
    projects: PropTypes.array.isRequired
};

export default connect(mapStateToProps, {fetchProjects})(Project);
