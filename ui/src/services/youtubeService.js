import requester from './requester';

export const getYoutubers = async (pageSize) => {
    return await requester('/youtube/list?size=' + pageSize, 'GET', false);
};

export const getProfile = async () => {
    return await requester('/youtube/profile', 'GET', true);
};

export const getYoutuberInfo = async () => {
    return await requester('/youtube/profile/info', 'GET', true);
};

export const getYoutuberDetails = async (youtuberId) => {
    return await requester(`/youtube/details/${youtuberId}`, 'GET', true);
};

export const refreshYoutuberData = async () => {
    return await requester('/youtube/profile/update', 'PATCH', true);
};
