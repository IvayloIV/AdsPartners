import { toast } from 'react-toastify';
import { LOAD_USER_INFO, CHECK_SUBSCRIPTION, SUBSCRIBE, YOUTUBERS_BY_SUBS, YOUTUBERS_LIST, YOUTUBERS_FILTERS } from '../actions/actionTypes';
import { getUserInfo, refreshUserData, checkSubscription, subscribe, getYoutubersBySubs, getYoutubers, getFilters, voteForYoutuber } from '../services/youtubeService';

function loadUserInfoAction() {
    return (dispatch) => {
        return getUserInfo()
            .then(json => {
                localStorage.setItem('username', json.name);
                localStorage.setItem('roles', JSON.stringify(json.authorities));
                // dispatch({ type: LOAD_USER_INFO, name: json.name }); TODO
            });
    };
}

function refreshUserDataAction() {
    return (dispatch) => {
        return refreshUserData().then(() => {
            toast.success("User data refreshed.");
        });
    };
}

function checkSubscriptionAction(companyId) {
    return (dispatch) => {
        return checkSubscription(companyId)
            .then(json => {
                dispatch({ type: CHECK_SUBSCRIPTION, data: json });
            });
    };
}

function subscribeAction(companyId) {
    return (dispatch) => {
        return subscribe(companyId)
            .then(json => {
                if (json.message != '') {
                    dispatch({ type: SUBSCRIBE, data: true });
                }
                toast.success(json.message);
            });
    };
}

function getYoutubersBySubsAction(pageSize) {
    return (dispatch) => {
        return getYoutubersBySubs(pageSize)
            .then(json => {
                dispatch({ type: YOUTUBERS_BY_SUBS, data: json });
                return json;
            });
    };
}

function getYoutubersAction(params) {
    return (dispatch) => {
        return getYoutubers(params)
            .then(json => {
                dispatch({ type: YOUTUBERS_LIST, data: json });
                return json;
            });
    };
}

function getYoutubersFiltersAction() {
    return (dispatch) => {
        return getFilters()
            .then(json => {
                dispatch({ type: YOUTUBERS_FILTERS, data: json });
                return json;
            });
    };
}

function voteForYoutuberAction(youtuberId, rating) {
    return (dispatch) => {
        return voteForYoutuber(youtuberId, rating)
            .then(json => {
                toast.success("You vote for youtuber successfully.");
            });
    };
}

export { loadUserInfoAction, refreshUserDataAction, checkSubscriptionAction, subscribeAction, 
    getYoutubersBySubsAction, getYoutubersAction, getYoutubersFiltersAction, voteForYoutuberAction };