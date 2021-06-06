import { getCookie } from './CookiesUtil';

const getRoles = () => {
    return JSON.parse(getCookie("roles"));
};

export const isAuthed = () => {
    return getCookie('accessToken') != null;
};

export const hasRole = (role) => {
    const roles = getRoles();
    return roles != null && roles.some(e => e == role);
};

export const hasAnyRole = (roles) => {
    const currRoles = getRoles();
    return currRoles != null && currRoles.some(r => roles.indexOf(r) != -1);
};
