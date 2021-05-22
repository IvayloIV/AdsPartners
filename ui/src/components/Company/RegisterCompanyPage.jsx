import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useDispatch } from "react-redux";
import { toast } from 'react-toastify';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import PhotoCamera from '@material-ui/icons/PhotoCamera';
import { Button } from 'semantic-ui-react';
import validations from '../../validations/register';
import {  registerCompanyAction } from '../../actions/companyActions';

const RegisterCompanyPage = (props) => {
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

    const onSubmitHandler = e => {
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

        dispatch(registerCompanyAction(params))
            .then(json => {
                if (json !== null) {
                    props.history.push("/");
                }
            })
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

export default RegisterCompanyPage;

/*class RegisterCompanyPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            userName: '',
            userEmail: '',
            userPassword: '',
            phone: '',
            incomeLastYear: '',
            town: '',
            description: '',
            companyCreationDate: '',
            workersCount: '',
            logo: null,
            validations: {
                userNameValidation: '',
                userEmailValidation: '',
                userPasswordValidation: '',
                phoneValidation: '',
                incomeLastYearValidation: '',
                townValidation: '',
                descriptionValidation: '',
                companyCreationDateValidation: '',
                logoValidation: null,
            }
        };

        this.onChangeHandler = this.onChangeHandler.bind(this);
        this.onChangeHandlerImage = this.onChangeHandlerImage.bind(this);
        this.onSubmitHandler = this.onSubmitHandler.bind(this);
    }

    onChangeHandler(e) {
        const name = e.target.name;
        const value = e.target.value;

        this.setState(prevState => {
            prevState['validations'][name + 'Validation'] = validations[name](value);
            return { [name]: value, validations: prevState.validations };
        });
    }

    onChangeHandlerImage(e) {
        this.setState({ logo: e.target.files[0] });
    }

    onSubmitHandler(e) {
        e.preventDefault();
        const params = this.state;

        // Validations
        this.props.register(params)
            .then((json) => {
                //TODO:
                //if (!json.success) { 
                //    toast.error(json.message);
                //    return;
                //}
                    
                //this.props.login(this.state.email, this.state.password, 'Register');
                toast.success('Register successfully.');
                this.props.history.push("/");
            });
    }

    static getDerivedStateFromProps(props, state) {
        if (localStorage.getItem("accessToken")) {
            props.history.push('/');
        }

        return null;
    }

    render() {
        console.log(this.state);

        return (
            <div className="container">
                <h1>Register your company</h1>
                <form onSubmit={this.onSubmitHandler}>
                    <TextField 
                        label="Email"
                        value={this.state.email}
                        name="userEmail"
                        onChange={this.onChangeHandler}
                    />
                    <TextField
                        type="password"
                        label="Password"
                        value={this.state.password}
                        name="userPassword"
                        onChange={this.onChangeHandler}
                    />
                    <TextField
                        label="Name"
                        value={this.state.name}
                        name="userName"
                        onChange={this.onChangeHandler}
                    />
                    <TextField
                        label="Phone"
                        value={this.state.phone}
                        name="phone"
                        onChange={this.onChangeHandler}
                    />
                    <TextField
                        type="number"
                        step="0.01"
                        label="Income last year"
                        value={this.state.incomeLastYear}
                        name="incomeLastYear"
                        onChange={this.onChangeHandler}
                    />
                    <TextField
                        label="Town"
                        value={this.state.town}
                        name="town"
                        onChange={this.onChangeHandler}
                    />
                    <TextField
                        multiline
                        rowsMax={4}
                        label="Description"
                        value={this.state.description}
                        name="description"
                        onChange={this.onChangeHandler}
                    />
                    <TextField
                        type="date"
                        label="Company creation date"
                        value={this.state.companyCreationDate}
                        onChange={this.onChangeHandler}
                        name="companyCreationDate"
                        InputLabelProps={{
                            shrink: true
                        }}
                    />
                    <TextField
                        type="number"
                        label="WorkersCount"
                        value={this.state.workersCount}
                        name="workersCount"
                        onChange={this.onChangeHandler}
                    />
                    <Input
                        name="logo"
                        type="file"
                        onChange={this.onChangeHandlerImage}
                        label="Logo"
                    />
                    <input type="submit" value="Register" />
                </form>
            </div>
        );
    }
}

function mapDispatch(dispatch) {
    return {
        register: (params) => dispatch(registerCompanyAction(params))
    };
}

export default withRouter(connect(null, mapDispatch)(RegisterCompanyPage));*/