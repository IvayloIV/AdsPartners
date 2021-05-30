import requester from './requester';
import toBase64 from './fileConverter';

export async function createAd(params) {
    let pictureBase64 = await toBase64(params.picture);

    return await requester('/ad/create', 'POST', true, {
        title: params.title,
        shortDescription: params.shortDescription,
        reward: params.reward,
        validTo: params.validTo,
        minVideos: params.minVideos,
        minSubscribers: params.minSubscribers,
        minViews: params.minViews,
        pictureBase64,
        characteristics: params.characteristics
    });
}

export async function editAd(id, title, shortDescription, reward, validTo, minVideos, minSubscribers, minViews, picture, characteristics) {
    let pictureBase64 = null;
    if (picture != null) {
        pictureBase64 = await toBase64(picture);
    }

    return await requester('/ad/edit/' + id, 'POST', true, {
        title, 
        shortDescription, 
        reward, 
        validTo, 
        minVideos, 
        minSubscribers, 
        minViews, 
        pictureBase64, 
        characteristics
    });
}

export async function deleteAd(adId) {
    return await requester('/ad/delete/' + adId, 'DELETE', true);
}

export async function getAds(params) {
    let query = addQueryParams(params);
    return await requester('/ad/list' + query, 'GET', true);
}

export async function getCompanyAds() {
    return await requester('/ad/list/company', 'GET', true);
}

export async function getCompanyAdsById(companyId) {
    return await requester('/ad/list/company/' + companyId, 'GET', true);
}

export async function getAdDetails(adId) {
    return await requester('/ad/details/' + adId, 'GET', true);
}

export async function applyForAd(adId, params) {
    return await requester('/ad/applyfor/' + adId, 'POST', true, params);
}

export async function getApplicationsByYoutuber(youtuberId) {
    return await requester('/ad/youtuber/applications/' + youtuberId, 'GET', true);
}

export async function getApplicationsByCompany(companyId) {
    return await requester('/ad/company/applications/' + companyId, 'GET', true);
}

export async function getApplications(adId) {
    return await requester('/ad/applications/' + adId, 'GET', true);
}

export async function voteForAd(adId, rating) {
    return await requester('/ad/vote/' + adId, 'POST', true, { rating });
}

export async function getFilters(params) {
    let query = addQueryParams(params);
    return await requester('/ad/filters' + query, 'GET', true);
}

export async function blockAd(adId) {
    return await requester('/ad/block/' + adId, 'POST', true);
}

export async function unblockAd(adId) {
    return await requester('/ad/unblock/' + adId, 'POST', true);
}

function addQueryParams(params) {
    let query = '?';

    for (let key in params) {
        let value = params[key];

        if (value && ((typeof value === 'object' && value.length !== 0) || value != '')) {
            if (query.length !== 1) {
                query += '&';
            }
            query += `${key}=${value}`;
        }
    }

    return query;
}