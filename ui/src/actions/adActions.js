import { toast } from 'react-toastify';
import { AD_LIST, AD_DETAILS, AD_FILTERS, AD_APPLICATIONS, AD_COMPANY_LIST, 
    COMPANY_APPLICATIONS_LIST, BLOCK_AD, UNBLOCK_AD, YOUTUBER_APPLICATIONS, DELETE_AD } from '../actions/actionTypes';
import { createAd, editAd, getAds, getAdDetails, getFilters, voteForAd, applyForAd, getApplications, 
    getCompanyAds, getApplicationsByCompany, getCompanyAdsById, blockAd, unblockAd, deleteAd,
    getApplicationsByYoutuber } from '../services/adService';

function getAllAdsAction(params) {
    return (dispatch) => {
        return getAds(params)
            .then(json => {
                console.log(json);
                dispatch({ type: AD_LIST, data: json });
            });
    };
}

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

function getAdsFiltersAction(params) {
    return (dispatch) => {
        return getFilters(params)
            .then(json => {
                console.log(json);
                dispatch({ type: AD_FILTERS, data: json });
            });
    };
}

function voteForAdAction(adId, rating) {
    return (dispatch) => {
        return voteForAd(adId, rating)
            .then(json => {
                // dispatch({ type: CREATE_AD, data: json });
                toast.success(`You vote for add successfully.`);
            });
    };
}

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

function getYoutuberApplicationAction(adId) {
    return (dispatch) => {
        return getApplicationsByYoutuber(adId)
            .then(json => {
                dispatch({ type: YOUTUBER_APPLICATIONS, data: json });
                toast.success(json.message);
            });
    };
}

export { getAllAdsAction, getCompanyAdsAction, getAdDetailsAction, getAdsFiltersAction, 
    createAdAction, editAdAction, deleteAdAction, voteForAdAction, applyForAdAction, getApplicationsAction, 
    getApplicationsByCompanyAction, getCompanyAdsByIdAction, blockAdAction, unblockAdAction,
    getYoutuberApplicationAction };