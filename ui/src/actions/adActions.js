import { toast } from 'react-toastify';
import { AD_LIST, AD_DETAILS, AD_FILTERS, AD_APPLICATIONS, AD_COMPANY_LIST, 
    COMPANY_APPLICATIONS_LIST, BLOCK_AD, UNBLOCK_AD, YOUTUBER_APPLICATIONS, DELETE_AD, VOTE_FOR_AD } from '../actions/actionTypes';
import { createAd, editAd, getAds, getAdDetails, getFilters, voteForAd, applyForAd, getApplications, 
    getCompanyAds, getApplicationsByCompany, getCompanyAdsById, blockAd, unblockAd, deleteAd,
    getApplicationsByYoutuber } from '../services/adService';

const getAllAdsAction = params => {
    return async (dispatch) => {
        const json = await getAds(params);
        dispatch({ type: AD_LIST, data: json });
    };
};

const getCompanyAdsAction = () => {
    return async (dispatch) => {
        const json = await getCompanyAds();
        dispatch({ type: AD_COMPANY_LIST, data: json });
    };
};

const getCompanyAdsByIdAction = companyId => {
    return async (dispatch) => {
        const json = await getCompanyAdsById(companyId);
        dispatch({ type: AD_COMPANY_LIST, data: json });
    };
};

const getAdDetailsAction = adId => {
    return async (dispatch) => {
        const json = await getAdDetails(adId);
        dispatch({ type: AD_DETAILS, data: json });
        return json;
    };
};

function applyForAdAction(adId, params) {
    return (dispatch) => {
        return applyForAd(adId, params)
            .then(json => {
                // dispatch({ type: AD_FILTERS, data: json });
                toast.success(json.message);
            });
    };
}

const getApplicationsByCompanyAction = companyId => {
    return async (dispatch) => {
        const json = await getApplicationsByCompany(companyId);
        dispatch({ type: COMPANY_APPLICATIONS_LIST, data: json });
    };
};

function getApplicationsAction(adId) {
    return (dispatch) => {
        return getApplications(adId)
            .then(json => {
                dispatch({ type: AD_APPLICATIONS, data: json });
            });
    };
}

const getAdsFiltersAction = params => {
    return async (dispatch) => {
        const json = await getFilters(params);
        dispatch({ type: AD_FILTERS, data: json });
    };
};

const voteForAdAction = (adId, rating) => {
    return async (dispatch) => {
        try {
            const json = await voteForAd(adId, rating);
            dispatch({ type: VOTE_FOR_AD, data: json });
            toast.success(`Благодарим за вашата оценка.`);
        } catch (err) {
            err.messages.forEach(e => toast.error(e));
        }
    };
};

const createAdAction = params => {
    return async () => {
        try {
            const json = await createAd(params);
            toast.success(json.message);
            return json;
        } catch (err) {
            err.messages.forEach(e => toast.error(e));
            return null;
        }
    };
};

const editAdAction = (adId, params) => {
    return async () => {
        try {
            const json = await editAd(adId, params);
            toast.success(json.message);
            return json;
        } catch (err) {
            err.messages.forEach(e => toast.error(e));
            return null;
        }
    };
};

const deleteAdAction = adId => {
    return async (dispatch) => {
        try {
            const json = await deleteAd(adId);
            dispatch({ type: DELETE_AD, data: adId });
            toast.success(json.message);
        } catch (err) {
            err.messages.forEach(e => toast.error(e));
        }
    };
};

const blockAdAction = adId => {
    return async (dispatch) => {
        try {
            const json = await blockAd(adId);
            dispatch({ type: BLOCK_AD, adId });
            toast.success(json.message);
        } catch (err) {
            err.messages.forEach(e => toast.error(e));
        }
    };
};

const unblockAdAction = adId => {
    return async (dispatch) => {
        try {
            const json = await unblockAd(adId);
            dispatch({ type: UNBLOCK_AD, adId });
            toast.success(json.message);
        } catch (err) {
            err.messages.forEach(e => toast.error(e));
        }
    };
};

const getYoutuberApplicationAction = youtuberId => {
    return async (dispatch) => {
        const json = await getApplicationsByYoutuber(youtuberId);
        dispatch({ type: YOUTUBER_APPLICATIONS, data: json });
    };
};

export { getAllAdsAction, getCompanyAdsAction, getAdDetailsAction, getAdsFiltersAction, 
    createAdAction, editAdAction, deleteAdAction, voteForAdAction, applyForAdAction, getApplicationsAction, 
    getApplicationsByCompanyAction, getCompanyAdsByIdAction, blockAdAction, unblockAdAction,
    getYoutuberApplicationAction };