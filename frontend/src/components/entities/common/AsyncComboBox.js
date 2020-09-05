// *https://www.registers.service.gov.uk/registers/country/use-the-api*
import axios from 'axios';
import React from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CircularProgress from '@material-ui/core/CircularProgress';
import {Controller} from "react-hook-form";


function sleep(delay = 0) {
    return new Promise((resolve) => {
        setTimeout(resolve, delay);
    });
}


// const URL = '/api/projects';
const PARAM_SEARCH = "search=";
const DEFAULT_PAGE_SIZE = 100;

// https://codesandbox.io/s/react-hook-form-controller-079xx?file=/src/MuiAutoComplete.js
function AsyncComboBox(props) {
    const {name, errors, defaultValue, control, label, url, optionLabel, rules} = props;
    const [open, setOpen] = React.useState(false);

    const [inputValue, setInputValue] = React.useState('');
    const [options, setOptions] = React.useState(defaultValue ? [{...defaultValue}] : []);

    const loading = open && options.length === 0;

    React.useEffect(() => {
        let active = true;

        if (!open) {
            return undefined;
        }

        (async () => {
            try {
                await sleep(1e3); // For demo purposes.
                const finalUrl = `${url}?${PARAM_SEARCH}${inputValue}&page_size=${DEFAULT_PAGE_SIZE}`;
                const response = await axios.get(finalUrl);
                if (active && response.data && response.data.results) {
                    setOptions(response.data.results);
                }
            } catch (err) {
                console.log(err);
            }
        })();

        return () => {
            active = false;
        };
    }, [inputValue, loading]);

    React.useEffect(() => {
        if (!open) {
            setOptions([]);
        }
    }, [open]);

    const handleInputChange = (event, newInputValue) => {
        setInputValue(newInputValue);
    };

    return (
        <Controller
            name={name}
            control={control}
            rules={rules}
            // defaultValue={options[0]}
            onChange={([, data]) => data}
            as={
                <Autocomplete
                    onInputChange={(event, newInputValue) => handleInputChange(event, newInputValue)}
                    inputValue={inputValue}
                    open={open}
                    onOpen={() => {
                        setOpen(true);
                    }}
                    onClose={() => {
                        setOpen(false);
                    }}
                    getOptionSelected={(option, value) => {
                        return option[optionLabel] === value[optionLabel]
                    }}
                    getOptionLabel={(option) => {
                        return option[optionLabel];
                    }}
                    options={options}
                    loading={loading}
                    renderInput={(params) => {
                        return (
                            <TextField
                                {...params}
                                label={label}
                                required
                                autoComplete='off'
                                // name={"sprintTextField"}
                                error={!!errors[name]}
                                helperText={errors[name] && errors[name].message}
                                InputProps={{
                                    // autoComplete: "off",
                                    ...params.InputProps,
                                    endAdornment: (
                                        <React.Fragment>
                                            {loading ? <CircularProgress color="inherit" size={20}/> : null}
                                            {params.InputProps.endAdornment}
                                        </React.Fragment>
                                    ),
                                }}
                            />
                        )
                    }}
                />}
        />
    );
}


export default AsyncComboBox;