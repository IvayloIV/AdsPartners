import requester from './requester';
import toBase64 from './fileConverter';

export async function createAd(title, shortDescription, reward, validTo, minVideos, minSubscribers, minViews, picture, characteristics) {
    let pictureBase64 = await toBase64(picture);

    return await requester('/ad/create', 'POST', true, {
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

export async function getAds(params) {
    let query = addQueryParams(params);
    return await requester('/ad/list' + query, 'GET', true);
}

export async function getAdDetails(adId) {
    return await requester('/ad/details/' + adId, 'GET', true);
}

export async function applyForAd(adId, params) {
    return await requester('/ad/applyfor/' + adId, 'POST', true, params);
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