export const title = value => {
    if (value.length < 3 || value.length > 256) {
        return 'Заглавието трябва да съдържа между 2 и 257 символа.';
    }

    return '';
};

export const shortDescription = value => {
    if (value.length > 1024) {
        return 'Описанието не трябва да надвищава 1024 символа.';
    }

    return '';
};

export const reward = value => {
    if (value === '') {
        return 'Възнаграждението е задължително.';
    }

    if (value < 0) {
        return 'Възнаграждението не трябва да бъде отрицателно.';
    }

    return '';
};

export const validTo = value => {
    if (value === '') {
        return 'Задължително е да предоставите крайна дата рекламата.';
    }

    if (new Date(value) - new Date() < 0) {
        return 'Датата трябва да бъде поне един ден валидна.';
    }

    return '';
};

export const minVideos = value => {
    if (value < 0) {
        return 'Броят видеа не може да бъде отрицателно число.';
    }

    return '';
};

export const minSubscribers = value => {
    if (value < 0) {
        return 'Броят абонати не може да бъде отрицателно число.';
    }

    return '';
};

export const minViews = value => {
    if (value < 0) {
        return 'Броят показвания не може да бъде отрицателно число.';
    }

    return '';
};

export const picture = value => {
    if (value === null) {
        return 'Задължително е да предоставите снимка на рекламата.';
    }

    return '';
};

export const charName = value => {
    if (value.length < 2) {
        return 'Името не може да бъде под 2 символа.';
    }

    return '';
};

export const charValue = value => {
    if (value.length === 0) {
        return 'Стойността не може да бъде празна.';
    }

    return '';
};
