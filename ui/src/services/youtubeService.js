import requester from './requester';

export async function getUserInfo() {
    return await requester('/youtube/profile/info', 'GET', true);
}

export async function refreshUserData() {
    return await requester('/youtube/profile/update', 'POST', true);
}