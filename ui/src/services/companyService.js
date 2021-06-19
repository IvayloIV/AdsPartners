import requester, { baseUrl } from './requester';
import { toBase64, createQueryParams } from './commonService';

export const registerCompany = async (params) => {
    let logoBase64 = null;

    if (params.logo != null) {
        logoBase64 = await toBase64(params.logo);
    }

    return await requester('/company/register', 'POST', false, {
        userName: params.userName,
        userEmail: params.userEmail,
        userPassword: params.userPassword,
        phone: params.phone,
        incomeLastYear: params.incomeLastYear,
        town: params.town,
        description: params.description,
        companyCreationDate: params.companyCreationDate,
        workersCount: params.workersCount,
        logoBase64,
        adminRedirectUrl: baseUrl + "/company/requests"
    });
};

export const loginCompany = async (params) => {
    return await requester('/company/login', 'POST', false, params);
};

export const getList = async (params) => {
    let query = createQueryParams(params);
    return await requester(`/company/list${query}`, 'GET', true);
};

export const getCompaniesByRating = async (pageSize) => {
    return await requester('/company/list/rating?size=' + pageSize, 'GET', false);
};

export const getCompaniesFilters = async () => {
    return await requester('/company/filters', 'GET', true);
};

export const getCompanyProfile = async () => {
    return await requester('/company/profile', 'GET', true);
};

export const getCompanyDetails = async (companyId) => {
    return await requester(`/company/details/${companyId}`, 'GET', true);
};

export const getRegisterRequests = async () => {
    return await requester('/company/register/requests', 'GET', true);
};

export const getRegisterHistory = async () => {
    return await requester('/company/register/history', 'GET', true);
};

export const updateRegisterStatus = async (companyId, status) => {
    return await requester(`/company/register/status/${companyId}`, 'PATCH', true, { status });
};
