import { toast } from 'react-toastify';
import * as types from '../actions/actionTypes';
import * as subscriptionService from '../services/subscriptionService';
import { handleException } from './commonActions';

export const getSubscribersAction = () => {
    return async (dispatch) => {
        const json = await subscriptionService.getSubscribers();
        dispatch({ type: types.GET_SUBSCRIBERS, data: json });
    };
};

export const subscribeAction = companyId => {
    return handleException(async (dispatch) => {
        const json = await subscriptionService.subscribe(companyId);
        dispatch({ type: types.SUBSCRIBE, data: true });
        toast.success(json.message);
    });
};

export const updateSubscriberStatusAction = (youtuberId, newStatus) => {
    return handleException(async (dispatch) => {
        const json = await subscriptionService.updateSubscriberStatus(youtuberId, newStatus);
        dispatch({ type: types.CHANGE_SUBSCRIBER_STATUS, data: { youtuberId, newStatus } });
        toast.success(json.message);
        return json;
    });
};

export const unsubscribeAction = companyId => {
    return handleException(async () => {
        const json = await subscriptionService.unsubscribe(companyId);
        toast.success(json.message);
    });
};

export const checkSubscriptionAction = companyId => {
    return async (dispatch) => {
        const json = await subscriptionService.checkSubscription(companyId);
        dispatch({ type: types.CHECK_SUBSCRIPTION, data: json });
    };
};
