import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useDispatch } from "react-redux";
import { toast } from 'react-toastify';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import PhotoCamera from '@material-ui/icons/PhotoCamera';
import { Button } from 'semantic-ui-react';
import * as validations from '../../validations/register';
import { registerCompanyAction } from '../../actions/companyActions';

export default props => {
    const [userName, setUserName] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [userPassword, setUserPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [incomeLastYear, setIncomeLastYear] = useState('');
    const [town, setTown] = useState('');
    const [description, setDescription] = useState('');
    const [companyCreationDate, setCompanyCreationDate] = useState('');
    const [workersCount, setWorkersCount] = useState('');
    const [logo, setLogo] = useState(null);

    const [userNameValidation, setUserNameValidation] = useState('');
    const [userEmailValidation, setUserEmailValidation] = useState('');
    const [userPasswordValidation, setUserPasswordValidation] = useState('');
    const [phoneValidation, setPhoneValidation] = useState('');
    const [incomeLastYearValidation, setIncomeLastYearValidation] = useState('');
    const [townValidation, setTownValidation] = useState('');
    const [descriptionValidation, setDescriptionValidation] = useState('');
    const [companyCreationDateValidation, setCompanyCreationDateValidation] = useState('');
    const [logoValidation, setLogoValidation] = useState('');
    
    const dispatch = useDispatch();

    const onChangeHandler = (e, setValue, setValidation) => {
        const name = e.target.name;
        const value = e.target.value;

        if (setValidation !== null) {
            setValidation(validations[name](value));
        }
        setValue(value);
    };

    const onChangeHandlerImage = e => {
        setLogoValidation('');
        setLogo(e.target.files[0]);
    };

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        let haveError = false;

        haveError = validateField('userName', userName, setUserNameValidation) || haveError;
        haveError = validateField('userEmail', userEmail, setUserEmailValidation) || haveError;
        haveError = validateField('userPassword', userPassword, setUserPasswordValidation) || haveError;
        haveError = validateField('phone', phone, setPhoneValidation) || haveError;
        haveError = validateField('incomeLastYear', incomeLastYear, setIncomeLastYearValidation) || haveError;
        haveError = validateField('town', town, setTownValidation) || haveError;
        haveError = validateField('description', description, setDescriptionValidation) || haveError;
        haveError = validateField('companyCreationDate', companyCreationDate, setCompanyCreationDateValidation) || haveError;
        haveError = validateField('logo', logo, setLogoValidation) || haveError;

        if (haveError) {
            toast.error('Поправете грешките в полетата.');
            return;
        }

        const params = { userName, userEmail, userPassword, phone, incomeLastYear, town, 
            description, companyCreationDate, workersCount, logo };

        const json = await dispatch(registerCompanyAction(params))
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
        <div className="register-container">
            <div className="register-info">
                <h1>Регистрирай твоята компания</h1>
                <p>Регистрирай компанията и стани част от нашия рекламен сайт. Намери подходящото рекламно лице за твоите реклами.
                    След регистрация ще проверим верността на предоставените данни от твоя страна и ще ти върнем разрешение до минути по мейл.</p>
                <Button color="teal" size="large" as={NavLink} to="/company/login">
                    Вече имаш регистрация ?
                </Button>
            </div>
            <div className="register-form">
                <form onSubmit={onSubmitHandler}>
                    <div className="register-company-field">
                        <TextField 
                            label="Мейл"
                            value={userEmail}
                            name="userEmail"
                            onChange={e => onChangeHandler(e, setUserEmail, setUserEmailValidation)}
                        />
                        <span>{userEmailValidation}</span>
                    </div>
                    <div className="register-company-field">
                        <TextField
                            type="password"
                            label="Парола"
                            value={userPassword}
                            name="userPassword"
                            onChange={e => onChangeHandler(e, setUserPassword, setUserPasswordValidation)}
                        />
                        <span>{userPasswordValidation}</span>
                    </div>
                    <div className="register-company-field">
                        <TextField
                            label="Име на комапанията"
                            value={userName}
                            name="userName"
                            onChange={e => onChangeHandler(e, setUserName, setUserNameValidation)}
                        />
                        <span>{userNameValidation}</span>
                    </div>
                    <div className="register-company-field">
                        <TextField
                            label="Телефон за връзка"
                            value={phone}
                            name="phone"
                            onChange={e => onChangeHandler(e, setPhone, setPhoneValidation)}
                        />
                        <span>{phoneValidation}</span>
                    </div>
                    <div className="register-company-field">
                        <TextField
                            type="number"
                            step="0.01"
                            label="Приходи през миналата година"
                            value={incomeLastYear}
                            name="incomeLastYear"
                            onChange={e => onChangeHandler(e, setIncomeLastYear, setIncomeLastYearValidation)}
                        />
                        <span>{incomeLastYearValidation}</span>
                    </div>
                    <div className="register-company-field">
                        <TextField
                            label="Град"
                            value={town}
                            name="town"
                            onChange={e => onChangeHandler(e, setTown, setTownValidation)}
                        />
                        <span>{townValidation}</span>
                    </div>
                    <div className="register-company-field">
                        <TextField
                            id="standard-multiline-static"
                            multiline
                            rowsMax={4}
                            rows={4}
                            label="Описание на дейността"
                            value={description}
                            name="description"
                            onChange={e => onChangeHandler(e, setDescription, setDescriptionValidation)}
                        />
                        <span>{descriptionValidation}</span>
                    </div>
                    <div className="register-company-field">
                        <TextField
                            type="date"
                            label="Дата на създаване на компанията"
                            value={companyCreationDate}
                            onChange={e => onChangeHandler(e, setCompanyCreationDate, setCompanyCreationDateValidation)}
                            name="companyCreationDate"
                            InputLabelProps={{
                                shrink: true
                            }}
                        />
                        <span>{companyCreationDateValidation}</span>
                    </div>
                    <div className="register-company-field">
                        <TextField
                            type="number"
                            label="Брой работещи"
                            value={workersCount}
                            name="workersCount"
                            onChange={e => onChangeHandler(e, setWorkersCount, null)}
                        />
                    </div>
                    <div className="register-company-field">
                        <input
                            onChange={onChangeHandlerImage}
                            name="logo"
                            id="register-company-logo"
                            type="file"
                        />
                        <label htmlFor="register-company-logo" className="company-logo-label">
                            <IconButton color="primary" aria-label="upload picture" component="span">
                                <PhotoCamera />
                            </IconButton>
                            <span className="company-logo-value">{logo === null ? 'Лого' : logo.name}</span>
                        </label>
                        <span>{logoValidation}</span>
                    </div>
                    <Button color="blue" type="submit" id="register-company-button">Създай</Button>
                </form>
            </div>
        </div>
    );
};
