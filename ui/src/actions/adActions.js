import { toast } from 'react-toastify';
import * as types from '../actions/actionTypes';
import * as adService from '../services/adService';
import { handleException } from './commonActions';

export const getAllAdsAction = params => {
    return async (dispatch) => {
        const json = await adService.getAds(params);
        dispatch({ type: types.AD_LIST, data: json });
    };
};

export const getCompanyAdsAction = () => {
    return async (dispatch) => {
        const json = await adService.getCompanyAds();
        dispatch({ type: types.AD_COMPANY_LIST, data: json });
    };
};

export const getCompanyAdsByIdAction = companyId => {
    return async (dispatch) => {
        const json = await adService.getCompanyAdsById(companyId);
        dispatch({ type: types.AD_COMPANY_LIST, data: json });
    };
};

export const getAdFiltersAction = params => {
    return async (dispatch) => {
        const json = await adService.getFilters(params);
        dispatch({ type: types.AD_FILTERS, data: json });
    };
};

export const getAdDetailsAction = adId => {
    return handleException(async (dispatch) => {
        const json = await adService.getAdDetails(adId);
        dispatch({ type: types.AD_DETAILS, data: json });
        return json;
    });
};

export const createAdAction = params => {
    return handleException(async () => {
        const json = await adService.createAd(params);
        toast.success(json.message);
        return json;
    });
};

export const editAdAction = (adId, params) => {
    return handleException(async () => {
        const json = await adService.editAd(adId, params);
        toast.success(json.message);
        return json;
    });
};

export const deleteAdAction = adId => {
    return handleException(async (dispatch) => {
        const json = await adService.deleteAd(adId);
        dispatch({ type: types.DELETE_AD, data: adId });
        toast.success(json.message);
    });
};

export const voteForAdAction = (adId, rating) => {
    return handleException(async (dispatch) => {
        const json = await adService.voteForAd(adId, rating);
        dispatch({ type: types.VOTE_FOR_AD, data: json });
        toast.success(`Благодарим за вашата оценка.`);
    });
};

export const blockAdAction = adId => {
    return handleException(async (dispatch) => {
        const json = await adService.blockAd(adId);
        dispatch({ type: types.BLOCK_AD, adId });
        toast.success(json.message);
    });
};

export const unblockAdAction = adId => {
    return handleException(async (dispatch) => {
        const json = await adService.unblockAd(adId);
        dispatch({ type: types.UNBLOCK_AD, adId });
        toast.success(json.message);
    });
};
