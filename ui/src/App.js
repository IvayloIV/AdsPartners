import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route, Switch, withRouter } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { logoutAction } from './actions/companyActions';

import Header from './components/common/Header';
import RegisterCompanyPage from './components/Company/RegisterCompanyPage';
import LoginCompanyPage from './components/Company/LoginCompanyPage';
import LoginAdmin from './components/Admin/LoginAdmin';
import OAuth2RedirectHandler from './components/Youtube/OAuth2RedirectHandler';
import CompanyPage from './components/Company/CompanyPage';
import HomePage from './components/HomePage/HomePage';
import Profile from './components/Youtube/Profile';
import ListAd from './components/Ad/ListAd';
import PrivateRoute from './components/common/PrivateRoute';
import CreateAd from './components/Ad/CreateAd';
import AdDetails from './components/Ad/AdDetails';

class App extends Component {
    constructor(props) {
        super(props);

        this.onLogout = this.onLogout.bind(this);
    }

    onLogout() {
        this.props.logout();
		toast.success('Logout successful.');
        this.props.history.push('/');
    }

    render() {
        return (
            <div className="App">
				<ToastContainer closeButton={false}/>
                <Header loggedIn={localStorage.getItem('accessToken') != null} onLogout={this.onLogout} />
                <Switch>
                    <Route exact path="/" component={HomePage} />
                    <Route path="/company/login" component={LoginCompanyPage} />
                    <Route path="/company/register" component={RegisterCompanyPage} />
                    <Route path="/admin/login" component={LoginAdmin} />
                    <Route path="/oauth2/redirect" component={OAuth2RedirectHandler} />
                    <PrivateRoute authorities={["YOUTUBER"]} path="/youtube/profile" component={Profile} />
                    <PrivateRoute authorities={["YOUTUBER"]} path="/ad/list" component={ListAd} />
                    <PrivateRoute authorities={["YOUTUBER", "EMPLOYER"]} path="/ad/details/:adId" component={AdDetails} />
                    <PrivateRoute authorities={["ADMIN", 'EMPLOYER']} path="/company/page" component={CompanyPage} />
                    <PrivateRoute authorities={["ADMIN", 'EMPLOYER']} path="/ad/create" component={CreateAd} />
                </Switch>
            </div>
        );
    }
}

function mapState(state) {
    return {};
}

function mapDispatch(dispatch) {
    return {
        logout: () => dispatch(logoutAction())
    };
}


export default withRouter(connect(mapState, mapDispatch)(App));