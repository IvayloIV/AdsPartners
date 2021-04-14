import { toast } from 'react-toastify';
import { AD_LIST, CREATE_AD, AD_FILTERS } from '../actions/actionTypes';
import { createAd, getAds, getFilters, voteForAd } from '../services/adService';

function getAllAdsAction(params) {
    return (dispatch) => {
        return getAds(params)
            .then(json => {
                console.log(json);
                dispatch({ type: AD_LIST, data: json });
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

export { getAllAdsAction, getAdsFiltersAction, createAdAction, voteForAdAction };