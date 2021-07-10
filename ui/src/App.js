import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { YOUTUBER, EMPLOYER, ADMIN } from './utils/Roles';

import AnonymousRoute from './components/common/AnonymousRoute';
import PrivateRoute from './components/common/PrivateRoute';
import Header from './components/common/Header';
import HomePage from './components/Home/HomePage';
import LoginCompanyPage from './components/Company/LoginCompanyPage';
import RegisterCompanyPage from './components/Company/RegisterCompanyPage';
import LoginAdminPage from './components/Admin/LoginAdminPage';
import OAuth2RedirectHandler from './components/Youtube/OAuth2RedirectHandler';
import ListAdPage from './components/Ad/list/ListAdPage';
import AdDetailsPage from './components/Ad/details/AdDetailsPage';
import YoutuberDetailsPage from './components/Youtube/details/YoutuberDetailsPage';
import CreateAdPage from './components/Ad/CreateAdPage';
import EditAdPage from './components/Ad/EditAdPage';
import SubscribersPage from './components/Subscription/SubscribersPage';
import UnsubscribeHandler from './components/Subscription/UnsubscribeHandler';
import CompanyDetailsPage from './components/Company/details/CompanyDetailsPage';
import RegisterRequestsPage from './components/Company/registerRequests/RegisterRequestsPage';
import CompanyListPage from './components/Company/list/CompanyListPage';
import Footer from './components/common/Footer';

export default props => {
    return (
        <div className="App">
            <ToastContainer autoClose={2000} closeButton={false} pauseOnFocusLoss={false} />
            <Header history={props.history} />
            <Switch>
                <Route exact path="/" component={HomePage} />
                <Route path="/home" component={HomePage} />
                <AnonymousRoute path="/company/login" component={LoginCompanyPage} />
                <AnonymousRoute path="/company/register" component={RegisterCompanyPage} />
                <AnonymousRoute path="/admin/login" component={LoginAdminPage} />
                <AnonymousRoute path="/oauth2/redirect" component={OAuth2RedirectHandler} />
                <PrivateRoute authorities={[YOUTUBER]} path="/ad/list" component={ListAdPage} />
                <PrivateRoute authorities={[YOUTUBER, EMPLOYER, ADMIN]} path="/ad/details/:adId" component={AdDetailsPage} />
                <PrivateRoute authorities={[YOUTUBER]} path="/youtuber/profile" component={YoutuberDetailsPage} />
                <PrivateRoute authorities={[EMPLOYER, ADMIN]} path="/youtuber/details/:youtuberId" component={YoutuberDetailsPage} />
                <PrivateRoute authorities={[ADMIN, EMPLOYER]} path="/ad/create" component={CreateAdPage} />
                <PrivateRoute authorities={[EMPLOYER]} path="/ad/edit/:adId" component={EditAdPage} />
                <PrivateRoute authorities={[EMPLOYER]} path="/company/subscribers" component={SubscribersPage} />
                <PrivateRoute authorities={[YOUTUBER]} path="/company/:companyId/unsubscribe" component={UnsubscribeHandler} />
                <PrivateRoute authorities={[YOUTUBER, ADMIN]} path="/company/details/:companyId" component={CompanyDetailsPage} />
                <PrivateRoute authorities={[EMPLOYER]} path="/company/profile" component={CompanyDetailsPage} />
                <PrivateRoute authorities={[ADMIN]} path="/company/requests" component={RegisterRequestsPage} />
                <PrivateRoute authorities={[ADMIN]} path="/company/list" component={CompanyListPage} />
            </Switch>
            <Footer />
        </div>
    );
};
