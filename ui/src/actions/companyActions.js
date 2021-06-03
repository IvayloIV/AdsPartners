import { toast } from 'react-toastify';
import { GET_ALL_COMPANIES, GET_SUBSCRIBERS, CHANGE_SUBSCRIBER_STATUS,
    GET_COMPANY_DETAILS, GET_COMPANY_PROFILE, REGISTER_REQUESTS,
    REGISTER_HISTORY, UPDATE_REGISTER_STATUS, COMPANIES_BY_RATING, COMPANIES_FILTERS, COMPANIES_ADS } from '../actions/actionTypes';
import { registerCompany, loginCompany, getAllCompanies, getSubscribers, changeSubscriberStatus, 
    getCompanyDetails, getCompanyProfile, registerRequests, registerHistory, updateRegisterStatus, 
    getCompaniesByRating, getCompaniesFilters, getCompaniesByAds, offerPartnership } from '../services/companyService';
import { setCookie, deleteAllCookies } from '../utils/CookiesUtil';

function registerCompanyAction(params) {
    return async () => {
        try {
            const json = await registerCompany(params);
            toast.success(json.message);
            return json;
        } catch (err) {
            err.messages.forEach(m => toast.error(m));
            return null;
        }
    };
}

function loginCompanyAction(params) {
    return async () => {
        try {
            const json = await loginCompany(params);
            setCookie('accessToken', json.accessToken, 1);
            setCookie('username', json.username, 1);
            setCookie('roles', JSON.stringify(json.roles), 1);

            toast.success(`Успешно влязохте като компания в системата.`);
            return json;
        } catch (err) {
            err.messages.forEach(e => toast.error(e));
            return null;
        }
    };
}

function logoutAction() {
    return (dispatch) => {
        deleteAllCookies();
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

const getCompaniesRequests = () => {
    return async (dispatch) => {
        const json = await registerRequests();
        dispatch({ type: REGISTER_REQUESTS, data: json });
        return json;
    };
};

const getCompaniesHistoryAction = () => {
    return async (dispatch) => {
        const json = await registerHistory();
        dispatch({ type: REGISTER_HISTORY, data: json });
        return json;
    };
};

const updateCompanyStatusAction = (companyId, status) => {
    return async (dispatch) => {
        try {
            const json = await updateRegisterStatus(companyId, status);
            dispatch({ type: UPDATE_REGISTER_STATUS, data: json });
            toast.success("Успешно променихте статуса на компанията.");
        } catch (err) {
            err.messages.forEach(e => toast.error(e));
        }
    };
};

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
    getCompaniesRequests, getCompaniesHistoryAction, updateCompanyStatusAction,
    getCompaniesByRatingAction, getCompaniesFiltersAction, getCompaniesByAdsAction,
    offerPartnershipAction };