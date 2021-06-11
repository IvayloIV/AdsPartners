import { toast } from 'react-toastify';
import * as types from '../actions/actionTypes';
import * as companyService from '../services/companyService';
import { handleException } from './commonActions';
import { setCookie } from '../utils/CookiesUtil';

export const registerCompanyAction = params => {
    return handleException(async () => {
        const json = await companyService.registerCompany(params);
        toast.success(json.message);
        return json;
    });
};

export const loginCompanyAction = params => {
    return handleException(async () => {
        const json = await companyService.loginCompany(params);
        setCookie('accessToken', json.accessToken, 1);
        setCookie('username', json.username, 1);
        setCookie('roles', JSON.stringify(json.roles), 1);

        toast.success(`Успешно влязохте като компания в системата.`);
        return json;
    });
};

export const getCompanyListAction = params => {
    return async (dispatch) => {
        const json = await companyService.getList(params);
        dispatch({ type: types.COMPANIES_ADS, data: json });
    };
};

export const getCompaniesByRatingAction = pageSize => {
    return async (dispatch) => {
        const json = await companyService.getCompaniesByRating(pageSize);
        dispatch({ type: types.COMPANIES_BY_RATING, data: json });
        return json;
    };
};

export const getCompaniesFiltersAction = () => {
    return async (dispatch) => {
        const json = await companyService.getCompaniesFilters();
        dispatch({ type: types.COMPANIES_FILTERS, data: json });
    };
};

export const getCompanyProfileAction = () => {
    return handleException(async (dispatch) => {
        const json = await companyService.getCompanyProfile();
        dispatch({ type: types.GET_COMPANY_PROFILE, data: json });
    });
};

export const getCompanyDetailsAction = companyId => {
    return handleException(async (dispatch) => {
        const json = await companyService.getCompanyDetails(companyId);
        dispatch({ type: types.GET_COMPANY_DETAILS, data: json });
    });
};

export const getCompanyRequestsAction = () => {
    return async (dispatch) => {
        const json = await companyService.getRegisterRequests();
        dispatch({ type: types.REGISTER_REQUESTS, data: json });
        return json;
    };
};

export const getCompaniesHistoryAction = () => {
    return async (dispatch) => {
        const json = await companyService.getRegisterHistory();
        dispatch({ type: types.REGISTER_HISTORY, data: json });
        return json;
    };
};

export const updateCompanyStatusAction = (companyId, status) => {
    return handleException(async (dispatch) => {
        const json = await companyService.updateRegisterStatus(companyId, status);
        dispatch({ type: types.UPDATE_REGISTER_STATUS, data: json });
        toast.success("Успешно променихте статуса на компанията.");
    });
};
