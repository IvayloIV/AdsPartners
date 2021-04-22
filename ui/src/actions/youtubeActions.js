import { toast } from 'react-toastify';
import { LOAD_USER_INFO, CHECK_SUBSCRIPTION, SUBSCRIBE, YOUTUBERS_BY_SUBS } from '../actions/actionTypes';
import { getUserInfo, refreshUserData, checkSubscription, subscribe, getYoutubersBySubs } from '../services/youtubeService';

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

export { loadUserInfoAction, refreshUserDataAction, checkSubscriptionAction, subscribeAction, 
    getYoutubersBySubsAction };