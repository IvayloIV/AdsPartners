import { toast } from 'react-toastify';
import { REGISTER_COMPANY_SUCCESS, LOGIN_COMPANY_SUCCESS, GET_ALL_COMPANIES, GET_SUBSCRIBERS, CHANGE_SUBSCRIBER_STATUS, GET_COMPANY_DETAILS, GET_COMPANY_PROFILE } from '../actions/actionTypes';
import { registerCompany, loginCompany, getAllCompanies, getSubscribers, changeSubscriberStatus, getCompanyDetails, getCompanyProfile } from '../services/companyService';

function registerCompanyAction(email, password, name, workersCount, logo) {
    return (dispatch) => {
        return registerCompany(email, password, name, workersCount, logo)
            .then(json => {
                console.log(json); //TODO: check if register is success and json contains success object
                dispatch({ type: REGISTER_COMPANY_SUCCESS });

                return json;
            });
    };
}

function loginCompanyAction(email, password) {
    return (dispatch) => {
        return loginCompany(email, password)
            .then(json => {
                //TODO: check if register is success and json contains success object
                console.log(json);
                localStorage.setItem('accessToken', json.accessToken);
                localStorage.setItem('username', json.username); //TODO: get name and other things
                localStorage.setItem('roles', JSON.stringify(json.roles));
                dispatch({ type: LOGIN_COMPANY_SUCCESS });
                let msg = null;
                toast.success(`${msg || 'Login'} successful.`);
            });
    };
}

function logoutAction() {
    return (dispatch) => {
        localStorage.clear();
    };
}

function getAllCompaniesAction(params) {
    return (dispatch) => {
        return getAllCompanies(params)
            .then(json => {
                console.log(json);
                dispatch({ type: GET_ALL_COMPANIES, data: json });
                return json;
            });
    };
}

function getSubscribersAction() {
    return (dispatch) => {
        return getSubscribers()
            .then(json => {
                dispatch({ type: GET_SUBSCRIBERS, data: json });
                return json;
            });
    };
}

function changeSubscriberStatusAction(youtuberId, newStatus) {
    return (dispatch) => {
        return changeSubscriberStatus(youtuberId, newStatus)
            .then(json => {
                dispatch({ type: CHANGE_SUBSCRIBER_STATUS, data: { youtuberId, newStatus } });
                toast.info(json.message);
                return json;
            });
    };
}

function getCompanyDetailsAction(companyId) {
    return (dispatch) => {
        return getCompanyDetails(companyId)
            .then(json => {
                dispatch({ type: GET_COMPANY_DETAILS, data: json });
                return json;
            });
    };
}

function getCompanyProfileAction() {
    return (dispatch) => {
        return getCompanyProfile()
            .then(json => {
                dispatch({ type: GET_COMPANY_PROFILE, data: json });
                return json;
            });
    };
}

export { registerCompanyAction, loginCompanyAction, logoutAction, getAllCompaniesAction, getSubscribersAction,
    changeSubscriberStatusAction, getCompanyDetailsAction, getCompanyProfileAction };