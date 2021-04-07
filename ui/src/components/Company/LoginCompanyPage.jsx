import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { toast } from 'react-toastify';
import Input from '../common/Input';
import { loginCompanyAction } from '../../actions/companyActions';

class LoginPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            email: '',
            password: ''
        };

        this.onChangeHandler = this.onChangeHandler.bind(this);
        this.onSubmitHandler = this.onSubmitHandler.bind(this);
    }

    onChangeHandler(e) {
        this.setState({ [e.target.name]: e.target.value });
    }

    onSubmitHandler(e) {
        e.preventDefault();
        const { email, password } = this.state;
		//Validations
        this.props.login(email, password)
            .then(() => {
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
                <h1>Login Company</h1>
                <form onSubmit={this.onSubmitHandler}>
                    <Input
                        name="email"
                        value={this.state.email}
                        onChange={this.onChangeHandler}
                        label="Email"
                    />
                    <Input
                        name="password"
                        type="password"
                        value={this.state.password}
                        onChange={this.onChangeHandler}
                        label="Password"
                    />
                    <input type="submit" value="Login" />
                </form>
            </div>
        );
    }
}

function mapDispatch(dispatch) {
    return {
        login: (email, password) => dispatch(loginCompanyAction(email, password))
    };
}

export default withRouter(connect(null, mapDispatch)(LoginPage));