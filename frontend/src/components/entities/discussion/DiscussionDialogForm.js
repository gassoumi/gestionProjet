import React, {useEffect} from 'react';
import {withStyles} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import PropTypes from "prop-types";
import TextField from '@material-ui/core/TextField';
import SaveIcon from '@material-ui/icons/Save';
import CancelIcon from '@material-ui/icons/Cancel';

import {useForm} from "react-hook-form";
import {connect} from "react-redux";
import {updateDiscussion, createDiscussion} from "../../../redux/actions";


const styles = (theme) => ({
    root: {
        margin: 0,
        padding: theme.spacing(2),
    },
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
    },
});


const DialogTitle = withStyles(styles)((props) => {
    const {children, classes, onClose, ...other} = props;
    return (
        <MuiDialogTitle disableTypography className={classes.root} {...other}>
            <Typography variant="h6">{children}</Typography>
            {onClose ? (
                <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
                    <CloseIcon/>
                </IconButton>
            ) : null}
        </MuiDialogTitle>
    );
});


const DialogContent = withStyles((theme) => ({
    root: {
        padding: theme.spacing(2),
    },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
    root: {
        margin: 0,
        padding: theme.spacing(1),
    },
}))(MuiDialogActions);


function DiscussionDialogForm({
                                  open, handleClose, discussion,
                                  createDiscussion, updateDiscussion, isNew,
                              }) {

    const defaultValue = {
        object: discussion.object || "",
        description: discussion.description || "",
    };

    const {register, handleSubmit, errors, reset} = useForm({
        mode: "onChange",
        defaultValues: defaultValue,
    });

    // https://react-hook-form.com/v5/api/#reset
    // useEffect(() => {
    //     reset(defaultValue);
    // }, [discussion]);


    const onSubmit = data => {
        // console.log(data);
        if (isNew) {
            createDiscussion(data);
        } else {
            updateDiscussion(discussion.id, data)
        }
    };

    return (
        <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
            <DialogTitle id="form-dialog-ajout-discussion">
                {isNew ? "Ajouter une " : "Modifier la "} discussion
            </DialogTitle>
            <form id="form-discussion" onSubmit={handleSubmit(onSubmit)} noValidate>
                <DialogContent>
                    <TextField
                        fullWidth
                        name="object"
                        required
                        inputRef={register({
                            required: 'this field is required',
                            minLength: {
                                value: 2,
                                message: 'Max length is 2',
                            },
                        })}
                        autoFocus
                        margin="dense"
                        variant={"outlined"}
                        label="Objet du discussion"
                        autoComplete="disable"
                        type="text"
                        error={!!errors.object}
                        helperText={errors.object && errors.object.message}
                    />
                    <TextField
                        fullWidth
                        multiline
                        name="description"
                        required
                        inputRef={register({
                            required: 'this field is required',
                        })}
                        rows={5}
                        placeholder="Ecrire une description à propos votre discussion"
                        margin="dense"
                        label="Description du discussion"
                        autoComplete="disable"
                        variant={"outlined"}
                        type="text"
                        error={!!errors.description}
                        helperText={errors.description && errors.description.message}
                    />
                </DialogContent>
                <DialogActions>
                    <Button
                        form="form-discussion"
                        type="submit"
                        // startIcon={<SaveIcon/>}
                        variant="contained"
                        color="primary"
                    >
                        Enregistrer
                    </Button>
                    <Button
                        // startIcon={<CancelIcon/>}
                        onClick={handleClose}
                        variant="contained"
                        color="default"
                    >
                        Annuler
                    </Button>
                </DialogActions>
            </form>
        </Dialog>

    );
}


DiscussionDialogForm.propTypes = {};

// const mapStateToProps = state => ({
//     updateSuccess: state.entity.discussion.updateSuccess,
// });

export default connect(null, {createDiscussion, updateDiscussion})(DiscussionDialogForm);
