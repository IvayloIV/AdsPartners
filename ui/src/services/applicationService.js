import requester from './requester';

export const getApplicationsByAd = async (adId) => {
    return await requester(`/application/ad/${adId}`, 'GET', true);
};

export const getApplicationsByCompany = async (companyId) => {
    return await requester(`/application/company/${companyId}`, 'GET', true);
};

export const getApplicationsByYoutuber = async (youtuberId) => {
    return await requester(`/application/youtuber/${youtuberId}`, 'GET', true);
};

export const applyForAd = async (adId, params) => {
    return await requester(`/application/applyfor/${adId}`, 'POST', true, params);
};
