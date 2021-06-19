export const toBase64 = file => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
};

export const createQueryParams = params => {
    let query = '?';

    for (let key in params) {
        let value = params[key];

        if (value !== undefined && value !== '') {
            if (query.length !== 1) {
                query += '&';
            }
            query += `${key}=${value}`;
        }
    }

    return query;
};
