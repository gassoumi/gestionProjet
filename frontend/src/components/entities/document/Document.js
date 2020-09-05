import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import Loading from "../common/Loading";
import DocumentTable from "./DocumentTable";
import {Selector} from "../index";
import {connect} from "react-redux";
import {fetchDocuments, updateDocument} from "../../../redux";
import DeleteDialog from '../common/DeleteDialog';
import queryString from 'query-string';
import {makeStyles} from "@material-ui/core/styles";


const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,
    },
}));

Document.propTypes = {};

function Document(props) {

    const {
        canEdit, documents, count,
        fetchDocuments, isFetching, pageSize, page, updateDocument, deleteSuccess,
    } = props;

    const classes = useStyles();

    const [open, setOpen] = useState(false);
    // document to delete
    const [document, setDocument] = useState({});

    const state = queryString.parse(props.location.search).state || "AC";

    useEffect(() => {
        fetchDocuments(1, 5, `state=${state}`);
    }, [state]);

    useEffect(() => {
        if (deleteSuccess) {
            fetchDocuments(1, 5, `state=${state}`);
        }
    }, [deleteSuccess]);


    const createNew = () => {
        props.history.push('/document/create');
    };

    const handleEdit = (id) => {
        props.history.push(`/document/${id}/edit`);
    };

    const handleDelete = (document) => {
        setDocument(document);
        setOpen(true);
    };

    const deleteDocument = document => {
        if (document.state === 'AC') {
            const formData = new FormData();
            formData.append('state', 'EX');
            updateDocument(document.id, formData);
        }
    };

    return (
        <>
            <Grid container spacing={3}>
                <DeleteDialog
                    title={"Mettre à la liste des documents à périmés"}
                    open={open}
                    object={document}
                    handleClose={() => setOpen(false)}
                    deleteObject={deleteDocument}
                >
                    Êtes-vous sûr de vouloir de mettre ce document a la liste des documents à périmés
                    <b> {document.description}</b> ?
                </DeleteDialog>
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
                            Ajouter un document
                        </Button>
                    </Grid>
                </Grid>
                {isFetching ?
                    <Loading/>
                    :
                    (
                        < Grid container item xs={12} spacing={2}>
                            <DocumentTable
                                displayEditButton={state === 'AC'}
                                canEdit={canEdit}
                                rows={documents}
                                count={count}
                                handleEdit={handleEdit}
                                handleDelete={handleDelete}
                                fetchDocuments={fetchDocuments}
                                page={page - 1}
                                pageSize={pageSize}
                            />
                        </Grid>
                    )
                }
            </Grid>
        </>
    );
}

const mapStateToProps = (state) => {
    const {
        pagination: {documents},
        entity: {document}
    } = state;
    const listDocument = Selector.getDocumentsPage(state);

    return {
        documents: listDocument,
        nextPageUrl: documents.nextPageUrl,
        page: documents.page,
        count: documents.count,
        isFetching: documents.isFetching,
        canEdit: state.auth.user.is_staff || false,
        pageSize: documents.pageSize,
        deleteSuccess: document.deleteSuccess,
    };
};

export default connect(mapStateToProps, {fetchDocuments, updateDocument})(Document);