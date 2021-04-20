import requester from './requester';

export async function registerCompany(email, password, name, workersCount, logo) {
    let formData = new FormData();
    formData.append("userEmail", email);
    formData.append("userPassword", password);
    formData.append("userName", name);
    formData.append("workersCount", workersCount);
    formData.append("logo", logo);

    return await requester('/company/register', 'POST', false, formData);
}

export async function loginCompany(email, password) {
    return await requester('/company/login', 'POST', false, { email, password });
}

export async function getAllCompanies() {
    return await requester('/company/list', 'GET', true);
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