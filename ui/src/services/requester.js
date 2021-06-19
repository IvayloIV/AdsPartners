import { getCookie } from '../utils/CookiesUtil';

export const baseUrl = window.location.origin;
const baseRemoteUrl = 'http://localhost:8080';
export const googleRequestUrl = `${baseRemoteUrl}/oauth2/authorization/google?redirect_uri=${baseUrl}/oauth2/redirect`;

export default async (endPoint, type, auth, data) => {
    let obj = {
        method: type,
        headers: {
            'Accept-Language': 'bg' //navigator.language
        }
    };

    if (data !== undefined) {
        obj['headers']['Content-Type'] = 'application/json';
        obj['body'] = JSON.stringify(data);
    }

    if (auth) {
        obj['headers']['Authorization'] = `Bearer ${getCookie('accessToken')}`;
    }

    console.log(endPoint);
    const response = await fetch(baseRemoteUrl + endPoint, obj);
    let json = await response.json();

    if (!response.ok) {
        throw json;
    } else {
        return json;
    }
};
