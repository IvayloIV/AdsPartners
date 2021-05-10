import { toast } from 'react-toastify';
import { REGISTER_COMPANY_SUCCESS, LOGIN_COMPANY_SUCCESS, GET_ALL_COMPANIES, GET_SUBSCRIBERS, 
    CHANGE_SUBSCRIBER_STATUS, GET_COMPANY_DETAILS, GET_COMPANY_PROFILE, REGISTER_REQUESTS, 
    REGISTER_HISTORY, UPDATE_REGISTER_STATUS, COMPANIES_BY_RATING, COMPANIES_FILTERS, COMPANIES_ADS } from '../actions/actionTypes';
import { registerCompany, loginCompany, getAllCompanies, getSubscribers, changeSubscriberStatus, 
    getCompanyDetails, getCompanyProfile, registerRequests, registerHistory, updateRegisterStatus, 
    getCompaniesByRating, getCompaniesFilters, getCompaniesByAds, offerPartnership } from '../services/companyService';

function registerCompanyAction(params) {
    return (dispatch) => {
        return registerCompany(params)
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

function getCompanyRequestsAction() { //TODO: maybe rename to getCompaniesRequests
    return (dispatch) => {
        return registerRequests()
            .then(json => {
                dispatch({ type: REGISTER_REQUESTS, data: json });
                return json;
            });
    };
}

function getCompanyHistoryAction() {
    return (dispatch) => {
        return registerHistory()
            .then(json => {
                dispatch({ type: REGISTER_HISTORY, data: json });
                return json;
            });
    };
}

function updateCompanyStatusAction(companyId, status) {
    return (dispatch) => {
        return updateRegisterStatus(companyId, status)
            .then(json => {
                dispatch({ type: UPDATE_REGISTER_STATUS, data: json });
                toast.info("Status updated successfully.");
                return json;
            });
    };
}

function getCompaniesByRatingAction(pageSize) {
    return (dispatch) => {
        return getCompaniesByRating(pageSize)
            .then(json => {
                dispatch({ type: COMPANIES_BY_RATING, data: json });
                return json;
            });
    };
}

function getCompaniesFiltersAction() {
    return (dispatch) => {
        return getCompaniesFilters()
            .then(json => {
                dispatch({ type: COMPANIES_FILTERS, data: json });
                return json;
            });
    };
}

function getCompaniesByAdsAction(params) {
    return (dispatch) => {
        return getCompaniesByAds(params)
            .then(json => {
                dispatch({ type: COMPANIES_ADS, data: json });
                return json;
            });
    };
}

function offerPartnershipAction(adId, youtuberId, description) {
    return (dispatch) => {
        return offerPartnership(adId, youtuberId, description)
            .then(json => {
                toast.success(json.message);
                return json;
            }).catch((err) => {
                toast.error(err.message);
                return null;
            });
    };
}

export { registerCompanyAction, loginCompanyAction, logoutAction, getAllCompaniesAction, getSubscribersAction,
    changeSubscriberStatusAction, getCompanyDetailsAction, getCompanyProfileAction,
    getCompanyRequestsAction, getCompanyHistoryAction, updateCompanyStatusAction,
    getCompaniesByRatingAction, getCompaniesFiltersAction, getCompaniesByAdsAction,
    offerPartnershipAction };