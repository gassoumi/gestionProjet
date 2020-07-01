// *https://www.registers.service.gov.uk/registers/country/use-the-api*
import axios from 'axios';
import React from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CircularProgress from '@material-ui/core/CircularProgress';
import {tokenConfig, BASE_API} from "../../../services/api";
import {getMessageError} from "../../account/Login";
import {connect} from "react-redux";
import {returnErrors} from "../../../redux/actions/messages";

function sleep(delay = 0) {
    return new Promise((resolve) => {
        setTimeout(resolve, delay);
    });
}

const URL = '/api/auth/users';
const PARAM_SEARCH = "search=";

function ComboBoxUser(props) {
    const {register, name, errors, returnErrors,defaultValue} = props;
    const [open, setOpen] = React.useState(false);
    const [options, setOptions] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [inputValue, setInputValue] = React.useState('');

    React.useEffect(() => {
        let active = true;

        if (!open) {
            return undefined;
        }

        (async () => {
            try {
                setLoading(true);
                await sleep(1e3); // For demo purposes.
                const url = `${URL}?${PARAM_SEARCH}${inputValue}`;
                const response = await axios.get(url,tokenConfig());
                if (active && response.data && response.data.results) {
                    setOptions(response.data.results);
                }
            } catch (err) {
                returnErrors(err.response.data, err.response.status);
                console.log(err);
            } finally {
                setLoading(false);
            }
        })();

        return () => {
            active = false;
        };
    }, [inputValue, open]);

    React.useEffect(() => {
        if (!open) {
            setOptions([]);
        }
    }, [open]);

    const handleInputChange = (event, newInputValue) => {
        setInputValue(newInputValue);
    };

    return (
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
            getOptionSelected={(option, value) => option.username === value.username}
            getOptionLabel={(option) => option.username}
            options={options}
            loading={loading}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label="Username"
                    variant="outlined"
                    required
                    name={name}
                    inputRef={register({required: true})}
                    error={!!errors[name]}
                    helperText={getMessageError(errors, name)}
                    InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                            <React.Fragment>
                                {loading ? <CircularProgress color="inherit" size={20}/> : null}
                                {params.InputProps.endAdornment}
                            </React.Fragment>
                        ),
                    }}
                />
            )}
        />
    );
}

export default connect(null, {returnErrors})(ComboBoxUser);