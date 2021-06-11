import { toast } from 'react-toastify';
import * as types from '../actions/actionTypes';
import * as applicationService from '../services/applicationService';
import { handleException } from './commonActions';

export const getApplicationsByAdAction = adId => {
    return async (dispatch) => {
        const json = await applicationService.getApplicationsByAd(adId);
        dispatch({ type: types.AD_APPLICATIONS, data: json });
    };
};

export const getApplicationsByCompanyAction = companyId => {
    return async (dispatch) => {
        const json = await applicationService.getApplicationsByCompany(companyId);
        dispatch({ type: types.COMPANY_APPLICATIONS_LIST, data: json });
    };
};

export const getApplicationsByYoutuberAction = youtuberId => {
    return async (dispatch) => {
        const json = await applicationService.getApplicationsByYoutuber(youtuberId);
        dispatch({ type: types.YOUTUBER_APPLICATIONS, data: json });
    };
};

export const applyForAdAction = (adId, params) => {
    return handleException(async () => {
        const json = await applicationService.applyForAd(adId, params);
        toast.success(json.message);
    });
};
