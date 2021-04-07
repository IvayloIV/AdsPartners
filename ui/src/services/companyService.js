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