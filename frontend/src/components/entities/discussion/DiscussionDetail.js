import React, {useEffect, useState, Fragment} from 'react';
import PropTypes from 'prop-types';
import {Selector} from "../index";
import {connect} from "react-redux";
import {
    fetchDiscussion, fetchCommentsByDiscussion, createComment,
    clearCacheComment, updateComment, deleteCommentById,
} from "../../../redux";
import {makeStyles} from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Loading from '../common/Loading';
import moment from 'moment';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import TextField from '@material-ui/core/TextField';
import Button from "@material-ui/core/Button";
import CircularProgress from '@material-ui/core/CircularProgress';
import EditIcon from '@material-ui/icons/Edit';
import DiscussionDialogForm from "./DiscussionDialogForm";
import Comments from './Comments';
// import "./style.css";


DiscussionDetail.propTypes = {};

// https://stackoverflow.com/questions/23763482/text-not-wrapping-inside-a-div-element
const useStyles = makeStyles((theme) => ({
    paper: {
        padding: theme.spacing(2),
        wordWrap: 'break-word',
        wordBreak: 'break-word',
    },
    description: {
        marginTop: theme.spacing(1),
        // wordBreak: 'break-all',
        // wordWrap: 'break-word',

    },
    comments: {
        paddingLeft: theme.spacing(3)
    },
    inputComment: {
        marginTop: theme.spacing(2),
    },
    circularProgress: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        margin: theme.spacing(2),
        justifyContent: 'center'
    },
    buttons: {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
        // marginLeft: theme.spacing(1),
        // '& > *': {
        //     margin: theme.spacing(1),
        // },
    },
}));


function DiscussionDetail(props) {
    const id = props.match.params.id;
    const {
        isDiscussionLoaded, discussion, fetchDiscussion, createComment, nextPageUrl, page, count,
        fetchCommentsByDiscussion, comments, isFetchingComments, displayEditDiscussionButton,
        updateSuccessComment, updateSuccessDiscussion, authenticatedUser, clearCacheComment,
        updateComment, deleteCommentById, deleteSuccessComment,
    } = props;

    const classes = useStyles();

    const [inputComment, setInputComment] = useState("");
    const [pageToFetch, setPageToFetch] = useState(1);
    const [open, setOpen] = useState(false);


    // TODO how to use useState with prevState
    const [loading, setLoading] = React.useState(false);
    const handleClickLoading = () => {
        setLoading((prevLoading) => !prevLoading);
    };

    useEffect(() => {
        clearCacheComment();
        fetchDiscussion(id);
    }, [id]);

    // we fetch discussion first
    useEffect(() => {
        if (isDiscussionLoaded || updateSuccessComment || deleteSuccessComment) {
            fetchCommentsByDiscussion(1, 5, id);
            if (updateSuccessComment) {
                setInputComment('');
            }
        }
    }, [isDiscussionLoaded, updateSuccessComment, deleteSuccessComment]);

    useEffect(() => {
        if (updateSuccessDiscussion) {
            setOpen(false);
        }
    }, [updateSuccessDiscussion]);

    const handleLoadMoreComments = () => {
        if (nextPageUrl != null) {
            setPageToFetch(page + 1);
            fetchCommentsByDiscussion(page + 1, 5, id);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (inputComment) {
            const comment = {
                discussion: id,
                description: inputComment,
            };
            createComment(comment);
        }
    };

    const getProgressElement = () => (
        <div className={classes.circularProgress}>
            <CircularProgress disableShrink/>
        </div>
    );


    if (!isDiscussionLoaded) {
        return <Loading/>
    }
    // else
    return (
        <Grid container spacing={2}>
            <DiscussionDialogForm
                isNew={false}
                discussion={discussion}
                open={open}
                handleClose={() => setOpen(false)}
            />
            <Grid item xs={9}>
                <Paper className={classes.paper} elevation={2}>
                    <Grid container item xs={12}>
                        <Grid container justify={"flex-start"} item xs={6}>
                            <Typography variant={"h5"} gutterBottom={true}>
                                {discussion.object}
                            </Typography>
                        </Grid>
                        {displayEditDiscussionButton &&
                        <Grid item xs={6} container justify={"flex-end"}>
                            <Button startIcon={<EditIcon/>}
                                    onClick={() => setOpen(true)}
                                    type="button"
                                    variant="contained"
                                    color={"secondary"}
                            >
                                Modifier la discussion
                            </Button>
                        </Grid>
                        }

                    </Grid>
                    <Typography color={"textSecondary"} paragraph>
                        {`${moment(discussion.created_at).format('LL')} 
                                 par ${discussion.user.username}
                                 `}
                    </Typography>
                    <Divider/>
                    <Typography
                        className={classes.description} variant={"body1"} paragraph
                        gutterBottom={true}>
                        {discussion.description}
                    </Typography>
                    <Divider/>
                    {
                        isFetchingComments && pageToFetch === 1 ?
                            getProgressElement() :
                            (
                                <>
                                    <Typography variant={"h6"} gutterBottom>
                                        {`${count} commentaires`}
                                    </Typography>
                                    <div className={classes.comments}>
                                        <form onSubmit={handleSubmit} className={classes.inputComment} noValidate
                                              autoComplete="off">
                                            <TextField
                                                fullWidth
                                                value={inputComment}
                                                onChange={(e) => setInputComment(e.target.value)}
                                                name="commentInput"
                                                placeholder="Ajoouter un commentaire"
                                                multiline
                                            />
                                            <Grid container justify={"flex-end"} item xs={12}>
                                                <div className={classes.buttons}>
                                                    <Button disabled={!inputComment} type="submit"
                                                            variant="contained"
                                                            color="primary">
                                                        Ajouter un commentaire
                                                    </Button>
                                                </div>
                                            </Grid>
                                        </form>
                                        <Comments
                                            deleteCommentById={deleteCommentById}
                                            idDiscussion={id}
                                            updateComment={updateComment}
                                            comments={comments}
                                            authenticatedUser={authenticatedUser}
                                        />
                                        <Grid item xs={12}>
                                            {
                                                isFetchingComments ? getProgressElement() :
                                                    (nextPageUrl != null && <Button
                                                        fullWidth
                                                        onClick={handleLoadMoreComments}
                                                        variant="contained"
                                                        color="secondary">
                                                        Charger plus de commentaires
                                                    </Button>)
                                            }
                                        </Grid>
                                    </div>
                                </>
                            )
                    }
                </Paper>
            </Grid>
        </Grid>
    )

}

const mapStateToProps = (state, ownProps) => {
    const id = ownProps.match.params.id;
    const {
        pagination: {comments},
    } = state;

    const isLoaded = state.entity.discussion.isLoaded;
    const discussion = isLoaded ? Selector.getDiscussionById(state, id) : {};
    const listComments = Selector.getCommentsByIdDiscussion(state, id);

    // we don't need to check the state.auth.user.id
    // because this user is already authenticated
    const displayEditDiscussionButton = (discussion && discussion.user && discussion.user.id) ?
        discussion.user.id === state.auth.user.id : false;
    return {
        discussion,
        isDiscussionLoaded: isLoaded,
        comments: listComments,
        isFetchingComments: comments.isFetching,
        updateSuccessComment: state.entity.comment.updateSuccess,
        deleteSuccessComment: state.entity.comment.deleteSuccess,
        nextPageUrl: comments.nextPageUrl,
        page: comments.page,
        count: comments.count,
        updateSuccessDiscussion: state.entity.discussion.updateSuccess,
        displayEditDiscussionButton,
        authenticatedUser: state.auth.user,
    };
};

const mapDispatchToProps = ({
    fetchDiscussion,
    fetchCommentsByDiscussion,
    createComment,
    updateComment,
    deleteCommentById,
    clearCacheComment,
});

export default connect(mapStateToProps, mapDispatchToProps)(DiscussionDetail);