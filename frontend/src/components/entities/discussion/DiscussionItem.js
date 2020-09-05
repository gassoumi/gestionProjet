import React from 'react';
import PropTypes from 'prop-types';
import {makeStyles} from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import {Link as RouterLink} from 'react-router-dom';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import IconButton from '@material-ui/core/IconButton';
import Grid from '@material-ui/core/Grid';
import CardHeader from '@material-ui/core/CardHeader';
import Avatar from '@material-ui/core/Avatar';
import red from '@material-ui/core/colors/red';
import moment from 'moment' ;

const useStyles = makeStyles((theme) => ({
    root: {
        minWidth: 275,
        padding: theme.spacing(1),
    },
    bullet: {
        display: 'inline-block',
        margin: '0 2px',
        transform: 'scale(0.8)',
    },
    title: {
        // fontSize: 14,
        marginBottom: 12,
        // flex: '1 1 100%',
        // display: 'flex',
        padding: '12px',
    },
    avatar: {
        backgroundColor: red[500],
    },
    cardLink: {
        '&:hover': {
            // outline: 'none',
            color: 'none',
            textDecoration: 'none',
        },
    },
}));

function DiscussionItem(props) {
    const classes = useStyles();
    const {discussion} = props;
    const bull = <span className={classes.bullet}>•</span>;

    return (

        <Card className={classes.root}>
            <CardHeader
                avatar={
                    <Avatar aria-label="recipe" className={classes.avatar}>
                        {discussion.object.charAt(0).toUpperCase()}
                    </Avatar>
                }
                action={
                    <IconButton aria-label="settings">
                        <MoreVertIcon/>
                    </IconButton>
                }
                title={<Link component={RouterLink} to={`discussion/${discussion.id}`} color="primary">
                    {discussion.object}
                </Link>}
                subheader=  {`Questionné en ${moment(discussion.created_at).format('LL')} par 
                                    ${discussion.user.username}`}
            />
                <CardContent>
                    {/*<Typography variant="h5" component="h2">*/}
                    {/*    <Grid container xs={12} item spacing={2}>*/}
                    {/*        <Grid className={classes.title} item xs={6}>*/}
                    {/*            <Link component={RouterLink} to={`discussion/${discussion.id}`} color="inherit">*/}
                    {/*                {discussion.object}*/}
                    {/*            </Link>*/}
                    {/*        </Grid>*/}
                    {/*        <Grid container item xs={6} justify={"flex-end"}>*/}
                    {/*            <IconButton className={classes.setting} aria-label="settings">*/}
                    {/*                <MoreVertIcon/>*/}
                    {/*            </IconButton>*/}
                    {/*        </Grid>*/}
                    {/*    </Grid>*/}
                    {/*</Typography>*/}

                    {/*<Grid container item xs={6} justify={"flex-end"}>*/}
                    {/*    <IconButton className={classes.setting} aria-label="settings">*/}
                    {/*        <MoreVertIcon/>*/}
                    {/*    </IconButton>*/}
                    {/*</Grid>*/}

                    <Typography variant="body1" component="p">
                        {discussion.description}
                        <br/>
                    </Typography>

                </CardContent>

        </Card>

    );
}

DiscussionItem.propTypes = {};

export default DiscussionItem;