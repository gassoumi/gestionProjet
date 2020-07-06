import React, {useEffect} from "react";
import {connect} from "react-redux";
import PropTypes from "prop-types";
import {fetchProjects} from "../../../redux";
import ProjectItem from "./ProjectItem";
import InfiniteScroll from 'react-infinite-scroller';
import {makeStyles} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';


const useStyles = makeStyles((theme) => ({
    cardGrid: {
        paddingTop: theme.spacing(2),
        paddingBottom: theme.spacing(8),
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
    }
}));


const cards = [1, 2, 3, 4, 5, 6, 7, 8, 9];
let ps;

function Project(props) {

    useEffect(() => props.fetchProjects(), []);
    const classes = useStyles();

    const {nextPageUrl} = props;
    const hasMoreItems = nextPageUrl !== null;


    const loadMore = () => {
        const hasMoreItems = nextPageUrl !== null;
        if (hasMoreItems && !props.isFetching) {
            props.fetchProjects(props.page + 1);
        }
    };

    return (
        <Grid className={classes.cardGrid} container spacing={2}>
            <InfiniteScroll
                loadMore={loadMore}
                hasMore={hasMoreItems}
                loader={<div className="loader" key={props.page}>Loading ...</div>}
            >
                <Grid container item xs={12} spacing={2}>
                    {props.projects.map((project, index, array) => (
                        <ProjectItem project={project} length={array.length} key={project.code_project}/>
                    ))}
                </Grid>
            </InfiniteScroll>
        </Grid>
    );
}


const mapStateToProps = (state) => {
    const {
        entities: {projects},
        pagination: {project},
    } = state;

    const listProjectIds = project.ids || [];
    const listProject = listProjectIds.map((id) => projects[id]);

    return {
        projects: listProject || [],
        nextPageUrl: project.nextPageUrl,
        page: project.page,
        isFetching: project.isFetching
    };
};

export default connect(mapStateToProps, {fetchProjects})(Project);
