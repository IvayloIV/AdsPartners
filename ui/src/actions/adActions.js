import { toast } from 'react-toastify';
import { AD_LIST, AD_DETAILS, CREATE_AD, AD_FILTERS, AD_APPLICATIONS } from '../actions/actionTypes';
import { createAd, getAds, getAdDetails, getFilters, voteForAd, applyForAd, getApplications } from '../services/adService';

function getAllAdsAction(params) {
    return (dispatch) => {
        return getAds(params)
            .then(json => {
                console.log(json);
                dispatch({ type: AD_LIST, data: json });
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

function createAdAction(title, shortDescription, reward, validTo, minVideos, minSubscribers, minViews, picture, characteristics) {
    return (dispatch) => {
        return createAd(title, shortDescription, reward, validTo, minVideos, minSubscribers, minViews, picture, characteristics)
            .then(json => {
                console.log(json);
                dispatch({ type: CREATE_AD, data: json });
                let msg = null;
                toast.success(`${msg || 'Ad created'} successfully.`);
            });
    };
}

export { getAllAdsAction, getAdDetailsAction, getAdsFiltersAction, 
    createAdAction, voteForAdAction, applyForAdAction, getApplicationsAction };