import React from 'react';
import PropTypes from 'prop-types';
import {makeStyles} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Hidden from '@material-ui/core/Hidden';
import moment from "moment";
import Link from '@material-ui/core/Link';
import {Link as RouterLink} from 'react-router-dom';

const useStyles = makeStyles({
    card: {
        display: 'flex',
        maxHeight: 400,
        wordWrap: 'break-word',
        wordBreak: 'break-word',
    },
    cardDetails: {
        flex: 1,
    },
    link: {

        '&:hover': {
            // outline: 'none',
            color: 'none',
            textDecoration: 'none',
        },
    },
    // cardActionArea : {
    //     '&:hover': {
    //         color: '#007bff',
    //     },
    // }
});


export default function DiscussionItem2(props) {
    const classes = useStyles();
    const {discussion} = props;


    return (
        <Grid container item xs={9}>
            <CardActionArea className={classes.cardActionArea}>
                <Link className={classes.link} component={RouterLink} to={`discussion/${discussion.id}`}>
                    <Card className={classes.card}>
                        <div className={classes.cardDetails}>
                            <CardContent>
                                <Typography component="h2" variant="h5">
                                    {discussion.object}
                                </Typography>
                                <Typography variant="subtitle1" color="textSecondary">
                                    {`${moment(discussion.created_at).format('LL')} par 
                                    ${discussion.user.username}`}
                                </Typography>
                                <Typography variant="subtitle1" paragraph>
                                    {discussion.description}
                                </Typography>
                                {/*<Typography variant="subtitle1" color="primary">*/}
                                {/*   Consulter...*/}
                                {/*</Typography>*/}
                            </CardContent>
                        </div>
                    </Card>
                </Link>
            </CardActionArea>
        </Grid>


    );
}

DiscussionItem2.propTypes = {
    discussion: PropTypes.object,
};