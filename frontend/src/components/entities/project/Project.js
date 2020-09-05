import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { fetchProjects, clearCacheProject } from "../../../redux";
import ProjectItem from "./ProjectItem";
import InfiniteScroll from 'react-infinite-scroller';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { Selector } from '../index';
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

    const { nextPageUrl, page } = props;
    const hasMoreItems = nextPageUrl !== null;
    const [pageToFetch, setPageToFetch] = useState(1);

    useEffect(() => {
        props.clearCacheProject();
        // setPageToFetch(page + 1);
        // props.fetchProjects();
    }, []);


    const loadMore = () => {
        // console.log(hasMoreItems);
        // console.log(pageToFetch);
        // console.log(page);
        if (hasMoreItems && !props.isFetching) {
            // console.log('load more');
            setPageToFetch(page + 1);
            // props.fetchProjects(pageToFetch);
        }
    };

    // TODO fix this later
    // see the js library used to load more data
    useEffect(() => {

        if (!props.isFetching && (pageToFetch !== page || pageToFetch === 1)) {
            // console.log(props.isFetching);
            // console.log(hasMoreItems);
            // console.log(pageToFetch);
            // setPageToFetch(page + 1);
            if (hasMoreItems || (pageToFetch === 1 & !hasMoreItems)) {
                props.fetchProjects(pageToFetch);
            }
        }
    }, [pageToFetch]);

    return (
        <Grid className={classes.cardGrid} container spacing={2}>
            {/*<CssBaseline/>*/}
            <InfiniteScroll
                className={classes.root}
                loadMore={loadMore}
                hasMore={hasMoreItems}
                // loader={<Loading key={props.page}/>}
                loader={<CircularProgress className={classes.loader} size={30} key={props.page} />}
            >
                <Grid container item xs={12} spacing={3}>
                    {props.projects.map((project, index, array) => (
                        <ProjectItem project={project} canEdit={props.canEdit} length={array.length}
                            key={project.id} />
                    ))}
                </Grid>
            </InfiniteScroll>
        </Grid>
    );
}


const mapStateToProps = (state) => {


    const {
        pagination: { projects },
    } = state;
    const listProject = Selector.getProjects(state);


    return {
        projects: listProject || [],
        nextPageUrl: projects.nextPageUrl,
        page: projects.page,
        isFetching: projects.isFetching,
        canEdit: state.auth.user.is_staff || false
    };
};

Project.prototype = {
    projects: PropTypes.array.isRequired
};

export default connect(mapStateToProps, { fetchProjects, clearCacheProject })(Project);
