import { toast } from 'react-toastify';
import * as types from '../actions/actionTypes';
import * as youtubeService from '../services/youtubeService';
import { setCookie } from '../utils/CookiesUtil';
import { handleException } from './commonActions';

export const getYoutubersBySubsAction = pageSize => {
    return async (dispatch) => {
        const json = await youtubeService.getYoutubers(pageSize);
        dispatch({ type: types.YOUTUBERS_BY_SUBS, data: json });
        return json;
    };
};

export const getYoutuberProfileAction = () => {
    return handleException(async (dispatch) => {
        const json = await youtubeService.getProfile();
        dispatch({ type: types.YOUTUBER_PROFILE, data: json });
    });
};

export const loadUserInfoAction = () => {
    return async () => {
        const json = await youtubeService.getYoutuberInfo();
        setCookie('username', json.name, 1);
        setCookie('roles', JSON.stringify(json.authorities), 1);
    };
};

export const getYoutuberDetailsAction = youtuberId => {
    return handleException(async (dispatch) => {
        const json = await youtubeService.getYoutuberDetails(youtuberId);
        dispatch({ type: types.YOUTUBER_DETAILS, data: json });
    });
};

export const refreshYoutuberDataAction = () => {
    return handleException(async () => {
        const json = await youtubeService.refreshYoutuberData();
        toast.success(json.message);
    });
};
