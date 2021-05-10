const url = 'http://localhost:8080';

function requester(endPoint, type, auth, data) {
    let obj = {
        method: type
    };

    if (data instanceof FormData) {
        obj['body'] = data;
    } else {
        if (type === 'POST' || type === 'DELETE') {
            obj['headers'] = {
                'Content-Type': 'application/json'
            };
            obj['body'] = JSON.stringify(data);
        }
    }

    if (auth) {
        if(!obj['headers']) {
            obj['headers'] = {};
        }
        obj['headers']['Authorization'] = `Bearer ${localStorage.getItem('accessToken')}`;
    }

    console.log(obj);
    return fetch(url + endPoint, obj) //TODO: swap to axios
        .then(async (res) => {
            if (!res.ok) {
                let json = await res.json();
                throw new Error(json.message);
            }
            return res.json();
        });
}


export default requester;
