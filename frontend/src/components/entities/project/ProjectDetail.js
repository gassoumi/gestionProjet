import React, { useEffect, useState, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from "react-redux";
import Paper from '@material-ui/core/Paper';
import { Selector } from '../index'
import { fetchProjectById } from "../../../redux";
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import moment from 'moment';
import PeopleIcon from '@material-ui/icons/People';
import { green, yellow, purple } from "@material-ui/core/colors";


const useStyles = makeStyles((theme) => ({
    root: {
        wordWrap: 'break-word',
        wordBreak: 'break-word',
    },
    markdown: {
        ...theme.typography.body2,
        padding: theme.spacing(3, 0),
    },
    mainGrid: {
        marginTop: theme.spacing(3),
    },
    sidebarAboutBox: {
        padding: theme.spacing(2),
        //backgroundColor: theme.palette.grey[200],
    },
    sidebarSection: {
        marginTop: theme.spacing(3),
    },
}));


// TODO create not found page
function ProjectDetail(props) {

    const classes = useStyles();
    const id = props.match.params.id;
    const project = props.project;

    useEffect(() => {
        props.fetchProjectById(id);
    }, []);


    if (project != null) {
        return (
            <Fragment>
                <Grid className={classes.root} container spacing={5}>
                    <Grid className={classes.markdown} item xs={12} md={8}>
                        <Typography color={"error"} gutterBottom variant="h5">{project.designation}</Typography>
                        <Typography gutterBottom variant='caption' paragraph>
                            {moment(project.created_at).format('LL')}
                        </Typography>
                        <Typography color={"textPrimary"} gutterBottom variant="h6">Objective</Typography>
                        <Typography paragraph>
                            {project.objective}
                        </Typography>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Paper elevation={0} className={classes.sidebarAboutBox}>
                            <Typography variant="h6" gutterBottom className={classes.sidebarSection}>
                                <PeopleIcon style={{ color: purple[500] }} fontSize={"default"} />
                                Team Scrum
                            </Typography>
                            {project.projectUsers.map((projectUser) => (
                                <Typography display="block" variant="body1" key={projectUser.username}>
                                    {projectUser.username}
                                </Typography>
                            ))}
                        </Paper>
                    </Grid>
                </Grid>
            </Fragment>
        );
    } else {
        return <div> Project Not found or was deleted </div>
    }
}


ProjectDetail.propTypes = {
    project: PropTypes.object.isRequired,
    fetchProjectById: PropTypes.func.isRequired,
};

const mapStateToProps = (state, ownProps) => {
    const id = ownProps.match.params.id;
    const project = Selector.getProjectById(state, id);
    return {
        project
    }
};

export default connect(mapStateToProps, { fetchProjectById })(ProjectDetail);
