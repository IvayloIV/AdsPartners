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
import HomePage from './components/HomePage/HomePage';
import ListAd from './components/Ad/ListAd';
import PrivateRoute from './components/common/PrivateRoute';
import CreateAd from './components/Ad/CreateAd';
import AdDetails from './components/Ad/AdDetails';
import SubscribersPage from './components/Company/SubscribersPage';
import CompanyDetailsPage from './components/Company/CompanyDetailsPage';
import RegisterRequests from './components/Company/RegisterRequests';
import CompanyBlockPage from './components/Company/CompanyBlockPage';
import EditAd from './components/Ad/EditAd';
import DeleteAd from './components/Ad/DeleteAd';
import ListYoutuber from './components/Youtube/ListYoutuber';
import OfferPartnership from './components/Company/OfferPartnership';
import YoutuberDetails from './components/Youtube/YoutuberDetails';

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
        const isAuthed = localStorage.getItem('accessToken') != null;

        return (
            <div className="App">
				<ToastContainer closeButton={false}/>
                <Header loggedIn={isAuthed} onLogout={this.onLogout} />
                <Switch>
                    <Route exact
                        path="/"
                        render={(props) => (
                            <HomePage {...props} isAuthed={isAuthed} />
                        )} />
                    <Route path="/home"
                        render={(props) => (
                            <HomePage {...props} isAuthed={isAuthed} />
                        )} />
                    <Route path="/company/login" component={LoginCompanyPage} /> {/* //TODO: Validation only annonymous to reach page */}
                    <Route path="/company/register" component={RegisterCompanyPage} /> {/* //TODO: Validation only annonymous to reach page */}
                    <Route path="/admin/login" component={LoginAdmin} /> {/* //TODO: Validation only annonymous to reach page */}
                    <Route path="/oauth2/redirect" component={OAuth2RedirectHandler} /> {/* //TODO: Validation only annonymous to reach page */}
                    <PrivateRoute authorities={["YOUTUBER"]} path="/ad/list" component={ListAd} />
                    <PrivateRoute authorities={["YOUTUBER", "EMPLOYER"]} path="/ad/details/:adId" component={AdDetails} />
                    <PrivateRoute authorities={["YOUTUBER"]} path="/youtuber/profile" component={YoutuberDetails} />
                    <PrivateRoute authorities={["EMPLOYER"]} path="/youtuber/details/:youtuberId" component={YoutuberDetails} />
                    <PrivateRoute authorities={["ADMIN", 'EMPLOYER']} path="/ad/create" component={CreateAd} />
                    <PrivateRoute authorities={["EMPLOYER"]} path="/ad/edit/:adId" component={EditAd} />
                    <PrivateRoute authorities={["EMPLOYER"]} path="/ad/delete/:adId" component={DeleteAd} />
                    <PrivateRoute authorities={["EMPLOYER"]} path="/youtuber/offer/:youtuberId" component={OfferPartnership} />
                    <PrivateRoute authorities={['EMPLOYER']} path="/company/subscribers" component={SubscribersPage} />
                    <PrivateRoute authorities={['YOUTUBER', 'ADMIN']} path="/company/details/:companyId" component={CompanyDetailsPage} />
                    <PrivateRoute authorities={['EMPLOYER']} path="/company/profile" component={CompanyDetailsPage} />
                    <PrivateRoute authorities={['ADMIN']} path="/company/requests" component={RegisterRequests} />
                    <PrivateRoute authorities={['ADMIN']} path="/company/block" component={CompanyBlockPage} />
                    <PrivateRoute authorities={['EMPLOYER']} path="/youtuber/list" component={ListYoutuber} />
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