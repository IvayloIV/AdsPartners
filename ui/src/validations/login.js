function email(value) {
    if (value.length < 5 || value.length > 256) {
        return 'Мейлът трябва да е между 4 и 257 символа.';
    }

    if (value.indexOf('@') === -1) {
        return 'Невалиден мейл адрес.';
    }

    return '';
}

function password(value) {
    if (value.length < 3) {
        return 'Паролата трябва да е поне 3 символа.';
    }

    return '';
}

export default { email, password };