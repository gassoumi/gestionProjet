import React from "react";
import PropTypes from "prop-types";
import {Link} from "react-router-dom";
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import Grid from '@material-ui/core/Grid';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import {makeStyles} from '@material-ui/core/styles';
import CardActions from '@material-ui/core/CardActions';
import cx from 'clsx';
import BrandCardHeader from '@mui-treasury/components/cardHeader/brand';
import TextInfoContent from '@mui-treasury/components/content/textInfo';
import {useN03TextInfoContentStyles} from '@mui-treasury/styles/textInfoContent/n03';
import {useLightTopShadowStyles} from '@mui-treasury/styles/shadow/lightTop';
import InfiniteScroll from "react-infinite-scroller";
import {Link as RouterLink} from 'react-router-dom';


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

const ProjectItem = ({project, length}) => {
    const classes = useStyles();
    return (
        <Grid item xs={12} sm={getSm(length)} md={getMd(length)}>
            <Card className={classes.card}>
                <CardContent component="div" className={classes.cardContent}>
                    <Typography gutterBottom variant="h5" component="h2">
                        {project.designation}
                    </Typography>
                    <Typography variant="body2" component="p" paragraph>
                        {project.objective}
                    </Typography>
                </CardContent>
                <CardActions>
                    <Button size="small" color="primary">
                        View
                    </Button>
                    <Button  component={RouterLink} to={`project/${project.code_project}/edit`} size="small"
                            color="primary">
                        Edit
                    </Button>
                </CardActions>
            </Card>
        </Grid>
    );
};


ProjectItem.propTypes = {
    project: PropTypes.object.isRequired,
};

export default ProjectItem;