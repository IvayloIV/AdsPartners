import { toast } from 'react-toastify';
import { LOAD_USER_INFO, CHECK_SUBSCRIPTION, SUBSCRIBE, YOUTUBERS_BY_SUBS, YOUTUBERS_LIST,
    YOUTUBERS_FILTERS, YOUTUBER_PROFILE, YOUTUBER_DETAILS } from '../actions/actionTypes';
import { getUserInfo, refreshUserData, checkSubscription, subscribe, unsubscribe, getYoutubersBySubs,
    getYoutubers, getFilters, voteForYoutuber, getProfile, getYoutuberDetails } from '../services/youtubeService';
import { setCookie } from '../utils/CookiesUtil';

function loadUserInfoAction() {
    return (dispatch) => {
        return getUserInfo()
            .then(json => {
                setCookie('username', json.name, 1);
                setCookie('roles', JSON.stringify(json.authorities), 1);
                // dispatch({ type: LOAD_USER_INFO, name: json.name }); TODO
            });
    };
}

function refreshUserDataAction() {
    return (dispatch) => {
        return refreshUserData()
            .then((json) => {
                toast.success(json.message);
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

const unsubscribeAction = (companyId) => {
    return async () => {
        try {
            const json = await unsubscribe(companyId);
            toast.success(json.message);
        } catch (err) {
            err.messages.forEach(e => toast.error(e));
        };
    };
};

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

function getYoutuberProfileAction() {
    return (dispatch) => {
        return getProfile()
            .then(json => {
                dispatch({ type: YOUTUBER_PROFILE, data: json });
            });
    };
}

function getYoutuberDetailsAction(youtuberId) {
    return (dispatch) => {
        return getYoutuberDetails(youtuberId)
            .then(json => {
                dispatch({ type: YOUTUBER_DETAILS, data: json });
            });
    };
}

export { loadUserInfoAction, refreshUserDataAction, checkSubscriptionAction, subscribeAction, unsubscribeAction,
    getYoutubersBySubsAction, getYoutubersAction, getYoutubersFiltersAction, voteForYoutuberAction,
    getYoutuberProfileAction, getYoutuberDetailsAction };