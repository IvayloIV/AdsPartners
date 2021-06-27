import requester from './requester';

export const getSubscribers = async () => {
    return await requester('/subscription/list', 'GET', true);
};

export const subscribe = async (companyId) => {
    return await requester(`/subscription/subscribe/${companyId}`, 'POST', true);
};

export const updateSubscriberStatus = async (youtuberId, newStatus) => {
    return await requester(`/subscription`, 'PATCH', true, { 
        isBlocked: newStatus,
        youtuberId 
    });
};

export const unsubscribe = async (companyId) => {
    return await requester(`/subscription/unsubscribe/${companyId}`, 'DELETE', true);
};

export const checkSubscription = async (companyId) => {
    return await requester(`/subscription/check/${companyId}`, 'GET', true);
};
