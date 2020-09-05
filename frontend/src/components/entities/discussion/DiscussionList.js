import React from 'react';
import PropTypes from 'prop-types';
import DiscussionItem from './DiscussionItem';
import DiscussionItem2 from './DiscussionItem2';
import Grid from '@material-ui/core/Grid';
import {makeStyles} from '@material-ui/core/styles';


const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing(2),
    },
}));

function DiscussionList(props) {
    const {discussions} = props;
    const classes = useStyles();
    return (
        <>
            <div className={classes.root}>
                <Grid container  justify="center" spacing={3}>
                    {discussions.map(discussion => (
                        <DiscussionItem2
                            key={discussion.id}
                            discussion={discussion}
                        />
                    ))}
                </Grid>
                {/* <Grid container spacing={3}>*/}
                {/*    {discussions.map(discussion => (*/}
                {/*        <Grid key={discussion.id} item xs={12}>*/}
                {/*            <DiscussionItem*/}
                {/*                discussion={discussion}*/}
                {/*            />*/}
                {/*        </Grid>*/}
                {/*    ))}*/}
                {/*</Grid>*/}
            </div>
        </>
    );
}

DiscussionList.propTypes = {};

export default DiscussionList;