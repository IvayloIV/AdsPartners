import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route, Switch, withRouter } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { logoutAction } from './actions/commonActions';

import Header from './components/common/Header';
import Footer from './components/common/Footer';
import RegisterCompanyPage from './components/Company/RegisterCompanyPage';
import LoginCompanyPage from './components/Company/LoginCompanyPage';
import LoginAdminPage from './components/Admin/LoginAdminPage';
import OAuth2RedirectHandler from './components/Youtube/OAuth2RedirectHandler';
import HomePage from './components/HomePage/HomePage';
import ListAdPage from './components/Ad/list/ListAdPage';
import AnonymousRoute from './components/common/AnonymousRoute';
import PrivateRoute from './components/common/PrivateRoute';
import CreateAd from './components/Ad/CreateAd';
import AdDetails from './components/Ad/AdDetails';
import SubscribersPage from './components/Subscription/SubscribersPage';
import UnsubscribePage from './components/Subscription/UnsubscribePage';
import CompanyDetailsPage from './components/Company/details/CompanyDetailsPage';
import RegisterRequests from './components/Company/registerRequests/RegisterRequests';
import CompanyListPage from './components/Company/list/CompanyListPage';
import EditAd from './components/Ad/EditAd';
import YoutuberDetailsPage from './components/Youtube/details/YoutuberDetailsPage';
import { YOUTUBER, EMPLOYER, ADMIN } from './utils/Roles';

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
                <Header onLogout={this.onLogout} />
                <Switch>
                    <Route exact path="/" component={HomePage} />
                    <Route path="/home" component={HomePage} />
                    <AnonymousRoute path="/company/login" component={LoginCompanyPage} />
                    <AnonymousRoute path="/company/register" component={RegisterCompanyPage} />
                    <AnonymousRoute path="/admin/login" component={LoginAdminPage} />
                    <AnonymousRoute path="/oauth2/redirect" component={OAuth2RedirectHandler} />
                    <PrivateRoute authorities={[YOUTUBER]} path="/ad/list" component={ListAdPage} />
                    <PrivateRoute authorities={[YOUTUBER, EMPLOYER, ADMIN]} path="/ad/details/:adId" component={AdDetails} />
                    <PrivateRoute authorities={[YOUTUBER]} path="/youtuber/profile" component={YoutuberDetailsPage} />
                    <PrivateRoute authorities={[EMPLOYER]} path="/youtuber/details/:youtuberId" component={YoutuberDetailsPage} />
                    <PrivateRoute authorities={[ADMIN, EMPLOYER]} path="/ad/create" component={CreateAd} />
                    <PrivateRoute authorities={[EMPLOYER]} path="/ad/edit/:adId" component={EditAd} />
                    <PrivateRoute authorities={[EMPLOYER]} path="/company/subscribers" component={SubscribersPage} />
                    <PrivateRoute authorities={[YOUTUBER]} path="/company/:companyId/unsubscribe" component={UnsubscribePage} />
                    <PrivateRoute authorities={[YOUTUBER, ADMIN]} path="/company/details/:companyId" component={CompanyDetailsPage} />
                    <PrivateRoute authorities={[EMPLOYER]} path="/company/profile" component={CompanyDetailsPage} />
                    <PrivateRoute authorities={[ADMIN]} path="/company/requests" component={RegisterRequests} />
                    <PrivateRoute authorities={[ADMIN]} path="/company/list" component={CompanyListPage} />
                </Switch>
                <Footer />
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