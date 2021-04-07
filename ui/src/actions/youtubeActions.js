import { toast } from 'react-toastify';
import { LOAD_USER_INFO } from '../actions/actionTypes';
import { getUserInfo, refreshUserData } from '../services/youtubeService';

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

export { loadUserInfoAction, refreshUserDataAction };