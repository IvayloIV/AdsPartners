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

export async function getYoutubersBySubs(pageSize) {
    return await requester('/youtube/list/subscribers?size=' + pageSize, 'GET', false);
}