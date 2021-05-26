import requester from './requester';

export async function loginAdmin(params) {
    return await requester('/admin/login', 'POST', false, params);
}