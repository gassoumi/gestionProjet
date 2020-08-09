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
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import moment from 'moment';
import SaveIcon from '@material-ui/icons/Save';
import CancelIcon from '@material-ui/icons/Cancel';
import Grid from "@material-ui/core/Grid";
import {useForm, Controller} from "react-hook-form";
import {connect} from "react-redux";
import {updateSprint, createSprint, fetchSprints} from "../../../redux/actions";
import ComboBoxProject, {sleep} from './ComboBoxProject';
import axios from "axios";
import {returnErrors} from "../index";

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


function SprintUpdate({
                          open = false, handleClose, sprint,
                          createSprint, updateSprint, isNew, updateSuccess, fetchSprints
                      }) {

    const [selectedProject, setSelectedProject] = React.useState(sprint.project || {});

    const {register, handleSubmit, errors, control} = useForm({
        mode: "onChange",
    });

    const onSubmit = data => {
        // console.log(data);

        const {name, project, desired_at: date, state} = data;

        const idProject = selectedProject.designation === project ? selectedProject.code_project :
            sprint.project.designation === project ? sprint.project.code_project : null;

        const newSprint = {
            name,
            project: idProject,
            state,
            desired_at: moment(date, "YYYY-MM-DDTHH:mm Z").toDate()
        };
        if (isNew) {
            createSprint(newSprint);
        } else {
            updateSprint(sprint.id, newSprint)
        }
        // console.log(newSprint);
        //handleClose();
    };

    useEffect(() => {
        if (updateSuccess) {
            handleClose();
            fetchSprints();
        }
    }, [updateSuccess]);

    // get the current date
    //moment().format('YYYY-MM-DDTHH:mm')

    return (
        <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
            <DialogTitle id="form-dialog-ajout-sprint">
                {isNew ? "Ajouter un " : "Modifier le "} sprint
            </DialogTitle>
            <form id="form-sprint" onSubmit={handleSubmit(onSubmit)} noValidate>
                <DialogContent>
                    {
                        false && <TextField
                            disabled
                            fullWidth
                            defaultValue={sprint.id || ""}
                            name="id"
                            inputRef={register}
                            margin="dense"
                            label="Id du Sprint"
                            type="text"
                        />
                    }
                    <TextField
                        fullWidth
                        defaultValue={sprint.name || ""}
                        name="name"
                        required
                        inputRef={register({
                            required: 'this field is a required',
                            minLength: {
                                value: 2,
                                message: 'Max length is 2',
                            },
                        })}
                        autoFocus
                        margin="dense"
                        label="Nom du Sprint"
                        autoComplete="disable"
                        type="text"
                        error={!!errors.name}
                        helperText={errors.name && errors.name.message}
                    />
                    <FormControl
                        fullWidth
                        margin="dense">
                        <ComboBoxProject
                            setSelectedProject={setSelectedProject}
                            register={register}
                            name={"project"}
                            errors={errors}
                            defaultValue={sprint.project || null}
                        />
                    </FormControl>
                    <FormControl
                        fullWidth
                        margin="dense"
                        required
                        error={!!errors.state}
                    >
                        <InputLabel id="demo-simple-select-label">Status</InputLabel>
                        <Controller
                            name="state"
                            defaultValue={sprint.state || ""}
                            as={
                                <Select
                                    required
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                >
                                    <MenuItem value="Planifiè">Planifiè</MenuItem>
                                    <MenuItem value="En Cours">En Cours</MenuItem>
                                    <MenuItem value={"Cloturé"}>Cloturé</MenuItem>
                                    <MenuItem value={"Archivé"}>Archivé</MenuItem>
                                </Select>
                            }
                            control={control}
                            rules={{required: 'this field is required'}}
                        />
                    </FormControl>
                    <TextField
                        required
                        inputRef={register({required: 'this field is required'})}
                        error={!!errors.desired_at}
                        helperText={errors.desired_at && errors.desired_at.message}
                        fullWidth
                        margin="dense"
                        name="desired_at"
                        label="Date souhaité"
                        // type="datetime-local"
                        type="date"
                        // defaultValue={moment(sprint.desired_at).format('YYYY-MM-DDTHH:mm') ||
                        // moment().format('YYYY-MM-DDTHH:mm')}
                        defaultValue={moment(sprint.desired_at).format('YYYY-MM-DD') ||
                        moment().format('YYYY-MM-DD')}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button
                        form="form-sprint"
                        type="submit"
                        startIcon={<SaveIcon/>}
                        variant="contained" color="primary">
                        Enregistrer
                    </Button>
                    <Button startIcon={<CancelIcon/>}
                            onClick={handleClose}
                            variant="contained" color="default">
                        Annuler
                    </Button>
                </DialogActions>
            </form>
        </Dialog>

    );
}


SprintUpdate.propTypes = {};

const mapStateToProps = state => ({
    updateSuccess: state.pagination.sprint.updateSuccess
});

export default connect(mapStateToProps, {createSprint, updateSprint})(SprintUpdate);
