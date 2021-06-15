import { getCookie } from '../utils/CookiesUtil';

export const baseUrl = window.location.origin;
const baseRemoteUrl = 'http://localhost:8080';
export const googleRequestUrl = `${baseRemoteUrl}/oauth2/authorization/google?redirect_uri=${baseUrl}/oauth2/redirect`;

function requester(endPoint, type, auth, data) {
    let obj = {
        method: type,
        headers: {
            'Accept-Language': 'bg' //TODO get location
        }
    };

    if (data instanceof FormData) {
        obj['body'] = data;
    } else {
        if (type !== 'GET') {
            obj['headers']['Content-Type'] = 'application/json';
            obj['body'] = JSON.stringify(data);
        }
    }

    if (auth) {
        obj['headers']['Authorization'] = `Bearer ${getCookie('accessToken')}`;
    }

    console.log(endPoint);
    return fetch(baseRemoteUrl + endPoint, obj) //TODO: swap to axios
        .then(async (res) => {
            if (!res.ok) {
                let json = await res.json();
                throw json;
            }
            return res.json();
        });
}


export default requester;
