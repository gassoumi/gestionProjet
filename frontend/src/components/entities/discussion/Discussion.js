import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import Grid from "@material-ui/core/Grid";


import {Selector} from "../index";
import {connect} from "react-redux";
import {fetchDiscussions} from "../../../redux";
import DiscussionList from './DiscussionList';
import Loading from '../common/Loading';
import {Link as RouterLink} from 'react-router-dom';
import Button from "@material-ui/core/Button";
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import Pagination from '@material-ui/lab/Pagination';
import Typography from "@material-ui/core/Typography";
import {makeStyles} from "@material-ui/core/styles";
import DiscussionDialogForm from './DiscussionDialogForm';


const useStyles = makeStyles((theme) => ({
    paginationDisplay: {
        // paddingLeft: theme.spacing(2),
        marginLeft: theme.spacing(2),
    },

}));

function Discussion(props) {

    const {
        canEdit, list, count, nextPageUrl, updateSuccess,
        fetchDiscussions, isFetching, pageSize, page,
    } = props;

    const classes = useStyles();

    const [discussion, setDiscussion] = useState({});
    const [page2, setPage] = React.useState(1);
    const [open, setOpen] = React.useState(false);


    useEffect(() => {
        fetchDiscussions();
    }, []);

    useEffect(() => {
        if (updateSuccess) {
            setOpen(false);
            fetchDiscussions();
        }
    }, [updateSuccess]);


    const handleEdit = (id) => {
        props.history.push(`discussion/${id}/edit`);
    };


    const createNew = () => {
        // props.history.push("/discussion/create");
        setOpen(true);
    };

    const handleChange = (event, value) => {
        //setPage(value);
        fetchDiscussions(value);
    };

    return (
        <>
            <DiscussionDialogForm
                isNew
                discussion={{}}
                open={open}
                handleClose={() => setOpen(false)}
            />
            <Grid container spacing={4}>
                <Grid item xs={12} container spacing={2}>
                    <Grid xs={6} item container justify={"flex-start"}>
                    </Grid>
                    <Grid xs={6} item container justify={"flex-end"}>
                        <Button startIcon={<AddCircleOutlineIcon/>}
                                onClick={createNew}
                                type="button"
                                variant="contained"
                                color={"secondary"}
                        >
                            Ajouter une discussion
                        </Button>
                    </Grid>
                </Grid>
                {isFetching ?
                    <Loading/>
                    :
                    (<>
                            < Grid item xs={12}>
                                <DiscussionList
                                    canEdit={canEdit}
                                    discussions={list}
                                    count={count}
                                    handleEdit={handleEdit}
                                    fetchDiscussions={fetchDiscussions}
                                    page={page - 1}
                                    pageSize={pageSize}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Grid container justify={"center"}>
                                    <Grid container item xs={9}>
                                        <Grid container item xs={6} justify={"flex-start"}>
                                            <Typography
                                                className={classes.paginationDisplay}
                                                variant={"body1"}
                                            >
                                                {`Affichage ${count === 0 ? 0 : (page - 1) * pageSize + 1}
                                                -${nextPageUrl == null ? count : page * pageSize}
                                                 De ${count} Discussion(s)`}
                                            </Typography>
                                        </Grid>
                                        <Grid container item xs={6} justify={"flex-end"}>
                                            <Pagination
                                                variant="outlined"
                                                color="secondary"
                                                count={Math.ceil(count / pageSize)}
                                                page={page}
                                                onChange={handleChange}/>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </>
                    )
                }
            </Grid>
        </>
    );
}

Discussion.propTypes = {};

const mapStateToProps = (state) => {
    const {
        pagination: {discussions},
    } = state;
    const listDiscussion = Selector.getDiscussionsPage(state);

    return {
        list: listDiscussion || [],
        nextPageUrl: discussions.nextPageUrl,
        page: discussions.page,
        isFetching: discussions.isFetching,
        canEdit: state.auth.user.is_staff || false,
        count: discussions.count,
        pageSize: discussions.pageSize,
        updateSuccess: state.entity.discussion.updateSuccess,
    };
};

export default connect(mapStateToProps, {fetchDiscussions})(Discussion);

