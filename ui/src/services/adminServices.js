import requester from './requester';

export async function loginAdmin(email, password) {
    return await requester('/admin/login', 'POST', false, { email, password });
}