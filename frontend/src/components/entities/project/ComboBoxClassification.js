/* eslint-disable no-use-before-define */
import React, {useState} from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import {getMessageError} from "../../account/Login";

export default function ComboBoxClassification({register, name, errors, defaultValue}) {

    return (
        <Autocomplete
            defaultValue={defaultValue}
            id={name}
            options={classifications2}
            getOptionLabel={(option) => option}
            renderInput={(params) => <TextField {...params} name={name} error={!!errors[name]}
                                                helperText={getMessageError(errors, name)}
                                                inputRef={register} label="User Classification"
                                                variant="outlined"/>}
        />
    );
}

/*
Scrum Master
/ Product Owner / Chef Equipe /
 Responsable Développement /
 Responsable /
  Conception/Assistante de direction
 */

const classifications2 = [
    'Scrum Master',
    'Project Owner',
    'Team Leader',
    'Responsible Development',
    'Responsible',
    'Conception',
    'Executive Assistant',
];

const classifications = [
    {title: 'Scrum Master'},
    {title: 'Project Owner '},
    {title: 'Team Leader'},
    {title: 'Responsible development'},
    {title: 'Responsible'},
    {title: 'Conception'},
    {title: 'Executive assistant'},
];
