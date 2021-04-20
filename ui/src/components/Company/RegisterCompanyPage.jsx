import React, { Component } from 'react';
import { toast } from 'react-toastify';
import { connect } from 'react-redux';
import axios from "axios";
import { withRouter } from 'react-router-dom';
import Input from '../common/Input';
import TextField from '@material-ui/core/TextField';
import {  registerCompanyAction } from '../../actions/companyActions';

class RegisterCompanyPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            userName: '',
            userEmail: '',
            userPassword: '',
            phone: '',
            incomeLastYear: 0,
            town: '',
            description: '',
            companyCreationDate: '',
            workersCount: 0,
            logo: null
        };

        this.onChangeHandler = this.onChangeHandler.bind(this);
        this.onChangeHandlerImage = this.onChangeHandlerImage.bind(this);
        this.onSubmitHandler = this.onSubmitHandler.bind(this);
    }

    onChangeHandler(e) {
        this.setState({ [e.target.name]: e.target.value });
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
                /*if (!json.success) { 
                    toast.error(json.message);
                    return;
                }*/
                    
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
        //TODO: when register login auto??
    };
}

export default withRouter(connect(null, mapDispatch)(RegisterCompanyPage));