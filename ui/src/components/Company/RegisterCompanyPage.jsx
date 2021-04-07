import React, { Component } from 'react';
import { toast } from 'react-toastify';
import { connect } from 'react-redux';
import axios from "axios";
import { withRouter } from 'react-router-dom';
import Input from '../common/Input';
import {  registerCompanyAction } from '../../actions/companyActions';

class RegisterCompanyPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            name: '',
            email: '',
            password: '',
            workersCount: 0,
            selectedFile: null
        };

        this.onChangeHandler = this.onChangeHandler.bind(this);
        this.onChangeHandlerImage = this.onChangeHandlerImage.bind(this);
        this.onSubmitHandler = this.onSubmitHandler.bind(this);
    }

    onChangeHandler(e) {
        this.setState({ [e.target.name]: e.target.value });
    }

    onChangeHandlerImage(e) {
        this.setState({ selectedFile: e.target.files[0] });
    }

    onSubmitHandler(e) {
        e.preventDefault();
        const { email, password, name, workersCount, selectedFile } = this.state;

        // Validations
        this.props.register(email, password, name, workersCount, selectedFile)
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
        return (
            <div className="container">
                <h1>Register your company</h1>
                <form onSubmit={this.onSubmitHandler}>
                    <Input
                        name="email"
                        value={this.state.email}
                        onChange={this.onChangeHandler}
                        label="E-mail"
                    />
                    <Input
                        name="password"
                        type="password"
                        value={this.state.password}
                        onChange={this.onChangeHandler}
                        label="Password"
                    />
                    <Input
                        name="name"
                        value={this.state.name}
                        onChange={this.onChangeHandler}
                        label="Name"
                    />
                    <Input
                        name="workersCount"
                        type="number"
                        value={this.state.workersCount}
                        onChange={this.onChangeHandler}
                        label="Workers Count"
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
        register: (email, password, name, workersCount, logo) => 
            dispatch(registerCompanyAction(email, password, name, workersCount, logo))
        //TODO: when register login auto??
    };
}

export default withRouter(connect(null, mapDispatch)(RegisterCompanyPage));