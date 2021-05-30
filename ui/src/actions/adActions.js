import { toast } from 'react-toastify';
import { AD_LIST, AD_DETAILS, CREATE_AD, AD_FILTERS, AD_APPLICATIONS, AD_COMPANY_LIST, 
    COMPANY_APPLICATIONS_LIST, BLOCK_AD, UNBLOCK_AD, YOUTUBER_APPLICATIONS } from '../actions/actionTypes';
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

function getCompanyAdsAction() {
    return (dispatch) => {
        return getCompanyAds()
            .then(json => {
                dispatch({ type: AD_COMPANY_LIST, data: json });
            });
    };
}

function getCompanyAdsByIdAction(companyId) {
    return (dispatch) => {
        return getCompanyAdsById(companyId)
            .then(json => {
                dispatch({ type: AD_COMPANY_LIST, data: json });
            });
    };
}

function getAdDetailsAction(adId) {
    return (dispatch) => {
        return getAdDetails(adId)
            .then(json => {
                console.log(json);
                dispatch({ type: AD_DETAILS, data: json });
            });
    };
}

function applyForAdAction(adId, params) {
    return (dispatch) => {
        return applyForAd(adId, params)
            .then(json => {
                // dispatch({ type: AD_FILTERS, data: json });
                toast.success(json.message);
            });
    };
}

function getApplicationsByCompanyAction(companyId) {
    return (dispatch) => {
        return getApplicationsByCompany(companyId)
            .then(json => {
                dispatch({ type: COMPANY_APPLICATIONS_LIST, data: json });
            });
    };
}

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

function editAdAction(id, title, shortDescription, reward, validTo, minVideos, minSubscribers, minViews, picture, characteristics) {
    return (dispatch) => {
        return editAd(id, title, shortDescription, reward, validTo, minVideos, minSubscribers, minViews, picture, characteristics)
            .then(json => {
                console.log(json);
                // dispatch({ type: CREATE_AD, data: json });
                let msg = null;
                toast.success(json.message);
            });
    };
}

function deleteAdAction(adId) {
    return (dispatch) => {
        return deleteAd(adId)
            .then(json => {
                toast.success(json.message);
            });
    };
}

function blockAdAction(adId) {
    return (dispatch) => {
        return blockAd(adId)
            .then(json => {
                dispatch({ type: BLOCK_AD, adId });
                toast.success(json.message);
            });
    };
}

function unblockAdAction(adId) {
    return (dispatch) => {
        return unblockAd(adId)
            .then(json => {
                dispatch({ type: UNBLOCK_AD, adId });
                toast.success(json.message);
            });
    };
}

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