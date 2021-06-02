import requester from './requester';

export async function getUserInfo() {
    return await requester('/youtube/profile/info', 'GET', true);
}

export async function refreshUserData() {
    return await requester('/youtube/profile/update', 'POST', true);
}

export async function checkSubscription(companyId) {
    return await requester('/company/subscription/check/' + companyId, 'GET', true);
}

export async function subscribe(companyId) {
    return await requester('/company/subscribe/' + companyId, 'POST', true);
}

export async function unsubscribe(companyId) {
    return await requester(`/company/${companyId}/unsubscribe`, 'POST', true);
}

export async function getYoutubersBySubs(pageSize) {
    return await requester('/youtube/list/subscribers?size=' + pageSize, 'GET', false);
}

export async function getYoutubers(params) {
    let query = addQueryParams(params);
    let data = await requester('/youtube/list' + query, 'GET', true);
    data["queryParams"] = query;
    return data;
}

export async function getFilters() {
    return await requester('/youtube/filters', 'GET', true);
}

export async function voteForYoutuber(youtuberId, rating) {
    return await requester('/youtube/vote/' + youtuberId, 'POST', true, { rating });
}

export async function getProfile() {
    return await requester('/youtube/profile', 'GET', true);
}

export async function getYoutuberDetails(youtuberId) {
    return await requester('/youtube/details/' + youtuberId, 'GET', true);
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