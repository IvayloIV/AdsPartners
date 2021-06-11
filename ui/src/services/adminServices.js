import requester from './requester';

export const loginAdmin = async (params) => {
    return await requester('/admin/login', 'POST', false, params);
};