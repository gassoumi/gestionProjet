import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import Grid from "@material-ui/core/Grid";

import {makeStyles} from '@material-ui/core/styles';
import Typography from "@material-ui/core/Typography";
import Loading from "../common/Loading";
import Paper from "@material-ui/core/Paper";
import DocumentForm from './DocumentForm';
import axios from "axios";


const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing(2),
        color: theme.palette.text.black,
    },
    formTitle: {
        textAlign: 'center',
    }
}));
// TODO
// handle not found
function DocumentUpdate(props) {

    const classes = useStyles();
    const isNew = !props.match.params || !props.match.params.id;
    // create state that receive props instead of using the props directly
    // it is the same
    // const [isNew, setIsNew] = useState(!props.match.params || !props.match.params.id);
    const [document, setDocument] = useState({});
    const [isLoaded, setIsLoaded] = useState(false);

    console.log(props.match.params.id);

    useEffect(() => {
        let active = true;

        const fetchDocument = async (id) => {
            try {
                const responseDocument = await axios.get(`/api/documents/${id}/`);
                const taskId = responseDocument.data.task;
                let responseTask = null;
                if (taskId) {
                    responseTask = await axios.get(`/api/tasks/${taskId}/`);
                }
                if (active) {
                    const newDocument = {
                        ...responseDocument.data,
                        task: responseTask && responseTask.data,
                    };
                    setDocument(newDocument);
                }
            } catch (e) {
                console.log(e);
            }
            if (active) {
                setIsLoaded(true);
            }
        };

        if (!isNew) {
            const id = props.match.params.id;
            fetchDocument(id);
        } else {
            setDocument({});
        }

        return () => {
            active = false;
        }
    }, [isNew]);


    const handleCancel = () => {
        // props.history.push("/document");
        props.history.goBack();
    };

    return (
        <>
            {!isNew && !isLoaded ?
                <Loading/> :
                <div className={classes.root}>
                    <Paper className={classes.paper} elevation={1}>
                        <Grid item container spacing={2}>
                            <Grid item xs={12}>
                                <Typography className={classes.formTitle} variant="h5" gutterBottom>
                                    {isNew ? "Ajouter un nouvel " : "Modifier le "} document
                                </Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <DocumentForm
                                    isNew={isNew}
                                    document={document}
                                    handleCancel={handleCancel}
                                />
                            </Grid>
                        </Grid>
                    </Paper>
                </div>
            }
        </>
    );
}

DocumentUpdate.propTypes = {};

export default DocumentUpdate;