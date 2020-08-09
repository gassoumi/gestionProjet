import React from "react";
import PropTypes from "prop-types";
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import Grid from '@material-ui/core/Grid';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import {makeStyles} from '@material-ui/core/styles';
import CardActions from '@material-ui/core/CardActions';
import {Link as RouterLink} from 'react-router-dom';
import moment from 'moment';
import {connect} from "react-redux";
import {Selector} from '../index';
import EditIcon from '@material-ui/icons/Edit';
import VisibilityIcon from '@material-ui/icons/Visibility';

//https://momentjs.com/docs/#/parsing/special-formats/

const useStyles = makeStyles((theme) => ({
    card: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
    },
    cardContent: {
        flexGrow: 1,
    },
}));

const getSm = (length) => {
    if (length === 1) {
        return 12;
    } else {
        return 6;
    }
};

const getMd = (length) => {
    if (length === 1) {
        return 12;
    } else if (length === 2) {
        return 6;
    } else {
        return 4;
    }
};

const ProjectItem = ({project, length, canEdit}) => {
    const classes = useStyles();

    return (
        <Grid item xs={12} sm={6} md={4}>
            <Card className={classes.card}>
                <CardContent component="div" className={classes.cardContent}>
                    <Typography gutterBottom variant="h5" component="h2">
                        {project.designation}
                    </Typography>
                    <Typography variant="body1" component="p">
                        {project.objective}
                    </Typography>
                </CardContent>
                <CardActions>
                    <Button startIcon={<VisibilityIcon/>} component={RouterLink} to={`project/${project.code_project}`}
                            size="small" color="primary">
                        View
                    </Button>
                    {canEdit && (
                        <Button startIcon={<EditIcon/>} component={RouterLink}
                                to={`project/${project.code_project}/edit`} size="small"
                                color="primary">
                            Edit
                        </Button>
                    )}
                </CardActions>
            </Card>
        </Grid>
    );
};


ProjectItem.propTypes = {
    project: PropTypes.object.isRequired,
};

const mapStateToProps = (state, ownProps) => {
    const username = state.auth.user.username || null;
    const idProject = ownProps.project.code_project || null;
    const canEdit = Selector.canEditProject(state, username, idProject);
    return {
        canEdit
    }
};

export default ProjectItem;