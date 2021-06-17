import React, { useState } from 'react';
import { useDispatch } from "react-redux";
import { toast } from 'react-toastify';
import TextField from '@material-ui/core/TextField';
import { Button } from 'semantic-ui-react';
import * as validations from '../../validations/login';
import { loginAdminAction } from '../../actions/adminActions';

export default props => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [emailValidation, setEmailValidation] = useState('');
    const [passwordValidation, setPasswordValidation] = useState('');
    
    const dispatch = useDispatch();

    const onChangeHandler = (e, setValue, setValidation) => {
        const name = e.target.name;
        const value = e.target.value;

        if (setValidation !== null) {
            setValidation(validations[name](value));
        }
        setValue(value);
    };

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        let haveError = false;

        haveError = validateField('email', email, setEmailValidation) || haveError;
        haveError = validateField('password', password, setPasswordValidation) || haveError;

        if (haveError) {
            toast.error('Поправете грешките в полетата.');
            return;
        }

        const params = { email, password };

        const json = await dispatch(loginAdminAction(params));
        if (json !== null) {
            props.history.push("/");
        }
    };

    const validateField = (name, value, setValidation) => {
        let validationValue = validations[name](value);
        setValidation(validationValue);
        return validationValue !== '';
    };

    return (
        <div className="login-container admin-login">
            <div className="login-form">
                <h1>Вход за администратор</h1>
                <form onSubmit={onSubmitHandler}>
                    <div className="login-field">
                        <TextField 
                            label="Мейл"
                            value={email}
                            name="email"
                            onChange={e => onChangeHandler(e, setEmail, setEmailValidation)}
                        />
                        <span>{emailValidation}</span>
                    </div>
                    <div className="login-field">
                        <TextField
                            type="password"
                            label="Парола"
                            value={password}
                            name="password"
                            onChange={e => onChangeHandler(e, setPassword, setPasswordValidation)}
                        />
                        <span>{passwordValidation}</span>
                    </div>
                    <div>
                        <Button color="blue" type="submit" id="login-button">Влез</Button>
                    </div>
                </form>
            </div>
        </div>
    );
};
