import requester, { baseUrl } from './requester';
import { toBase64, createQueryParams } from './commonService';

export const getAds = async (params) => {
    let query = createQueryParams(params);
    return await requester(`/ad/list${query}`, 'GET', true);
};

export const getCompanyAds = async () => {
    return await requester('/ad/list/company', 'GET', true);
};

export const getCompanyAdsById = async (companyId) => {
    return await requester(`/ad/list/company/${companyId}`, 'GET', true);
};

export const getFilters = async (params) => {
    let query = createQueryParams(params);
    return await requester(`/ad/filters${query}`, 'GET', true);
};

export const getAdDetails = async (adId) => {
    return await requester(`/ad/details/${adId}`, 'GET', true);
};

export const createAd = async (params) => {
    let pictureBase64 = await toBase64(params.picture);

    return await requester('/ad/create', 'POST', true, {
        title: params.title,
        description: params.description,
        reward: params.reward,
        validTo: params.validTo,
        minVideos: params.minVideos,
        minSubscribers: params.minSubscribers,
        minViews: params.minViews,
        pictureBase64,
        characteristics: params.characteristics,
        remoteUrl: baseUrl
    });
};

export const editAd = async (adId, params) => {
    let pictureBase64 = null;
    if (params.picture != null) {
        pictureBase64 = await toBase64(params.picture);
    }

    return await requester('/ad/edit/' + adId, 'PUT', true, {
        title: params.title,
        description: params.description,
        reward: params.reward,
        validTo: params.validTo,
        minVideos: params.minVideos,
        minSubscribers: params.minSubscribers,
        minViews: params.minViews,
        pictureBase64,
        characteristics: params.characteristics
    });
};

export const deleteAd = async (adId) => {
    return await requester(`/ad/delete/${adId}`, 'DELETE', true);
};

export const voteForAd = async (adId, rating) => {
    return await requester(`/ad/vote/${adId}`, 'POST', true, { rating });
};

export const blockAd = async (adId) => {
    return await requester(`/ad/block/${adId}`, 'PATCH', true);
};

export const unblockAd = async (adId) => {
    return await requester(`/ad/unblock/${adId}`, 'PATCH', true);
};
