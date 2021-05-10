import requester from './requester';

export async function registerCompany(params) {
    let formData = new FormData();
    for (let paramKey in params) {
        formData.append(paramKey, params[paramKey]);
    }
    
    return await requester('/company/register', 'POST', false, formData);
}

export async function loginCompany(email, password) {
    return await requester('/company/login', 'POST', false, { email, password });
}

export async function getAllCompanies() {
    return await requester('/company/list', 'GET', true);
}

export async function getCompaniesByRating(pageSize) {
    return await requester('/company/list/rating?size=' + pageSize, 'GET', false);
}

export async function getSubscribers() {
    return await requester('/company/subscribers', 'GET', true);
}

export async function changeSubscriberStatus(youtuberId, newStatus) {
    return await requester(`/company/subscriber/${youtuberId}/status`, 'POST', true, { isBlocked: newStatus });
}

export async function getCompanyDetails(companyId) {
    return await requester(`/company/details/${companyId}`, 'GET', true);
}

export async function getCompanyProfile() {
    return await requester('/company/profile', 'GET', true);
}

export async function registerRequests() {
    return await requester('/company/register/requests', 'GET', true);
}

export async function registerHistory() {
    return await requester('/company/register/history', 'GET', true);
}

export async function updateRegisterStatus(companyId, status) {
    return await requester('/company/register/status/' + companyId, 'POST', true, { status });
}

export async function getCompaniesFilters() {
    return await requester('/company/filters', 'GET', true);
}

export async function getCompaniesByAds(params) {
    let query = addQueryParams(params);
    console.log(query);
    return await requester('/company/list/ad' + query, 'GET', true);
}

export async function offerPartnership(adId, youtuberId, description) {
    return await requester('/company/offer', 'POST', true, { adId, youtuberId, description });
}

function addQueryParams(params) {
    let query = '?';

    for (let key in params) {
        let value = params[key];

        console.log(value);

        if (value != undefined && ((typeof value === 'object' && value.length !== 0) || 
                (typeof value === 'string' && value != '') || typeof value === 'number')) {
            if (query.length !== 1) {
                query += '&';
            }
            query += `${key}=${value}`;
        }
    }

    return query;
}