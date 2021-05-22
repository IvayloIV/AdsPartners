function userName(value) {
    if (value.length < 3 || value.length > 256) {
        return 'Името трябва да е между 2 и 257 символа.';
    }

    return '';
}

function userEmail(value) {
    if (value.length < 5 || value.length > 256) {
        return 'Мейлът трябва да е между 4 и 257 символа.';
    }

    if (value.indexOf('@') === -1) {
        return 'Невалиден мейл адрес.';
    }

    return '';
}

function userPassword(value) {
    if (value.length < 3) {
        return 'Паролата трябва да е поне 3 символа.';
    }

    return '';
}

function phone(value) {
    if (value.length < 3 || value.length > 64) {
        return 'Телефонът трябва да е между 2 и 65 символа.';
    }

    return '';
}

function incomeLastYear(value) {
    if (value === null) {
        return 'Задължително е да има стойност.';
    }

    if (value < 0.01) {
        return 'Не може приходите да са отрицателни.';
    }

    return '';
}

function town(value) {
    if (value.length < 3 || value.length > 256) {
        return 'Градът трябва да е между 2 и 257 символа.';
    }

    return '';
}

function description(value) {
    if (value.length === 0) {
        return 'Описанието е задължително.';
    }

    if (value.length > 1024) {
        return 'Описанието не трябва да бъде повече от 1024 символа.';
    }

    return '';
}

function companyCreationDate(value) {
    if (value === '') {
        return 'Задължително е да зададете дата.';
    }

    return '';
}

function logo(value) {
    if (value === null) {
        return 'Задължително е да въведете лого.';
    }

    return '';
}

export default { userName, userEmail, userPassword, phone, incomeLastYear, town, description, companyCreationDate, logo };