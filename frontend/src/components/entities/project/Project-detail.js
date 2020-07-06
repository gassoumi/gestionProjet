import React, {useEffect, useState, Fragment} from 'react';
import PropTypes from 'prop-types';
import {connect} from "react-redux";
import Paper from '@material-ui/core/Paper';
import {Selector} from '../index'
import {fetchProjectById} from "../../../redux";
import {makeStyles} from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import moment from 'moment';


const useStyles = makeStyles((theme) => ({
    markdown: {
        ...theme.typography.body2,
        padding: theme.spacing(3, 0),
    },
    mainGrid: {
        marginTop: theme.spacing(3),
    },
}));


// TODO create not found page
function ProjectDetail(props) {

    const classes = useStyles();
    const id = props.match.params.id;
    const project = props.project;


    useEffect(() => {
        console.log("use effect is called");
        props.fetchProjectById(id);
    }, []);


    if (project != null) {
        return (
            <Fragment>
                <Grid container spacing={5}>
                    <Grid className={classes.markdown} item xs={12} md={8}>
                        <Typography gutterBottom variant="h5">{project.designation}</Typography>
                        <Typography gutterBottom variant='caption' paragraph>
                            {moment(project.created_at).format('MMMM Do YYYY')}
                        </Typography>
                        <Typography paragraph>
                            {project.objective}
                        </Typography>
                    </Grid>
                </Grid>
            </Fragment>
        );
    } else {
        return <div> Project Not found or was deleted </div>
    }


}


ProjectDetail.propTypes = {};

const mapStateToProps = (state, ownProps) => {
    const id = ownProps.match.params.id;
    const project = Selector.getProjectById(state, id);
    return {
        project
    }
};

export default connect(mapStateToProps, {fetchProjectById})(ProjectDetail);
