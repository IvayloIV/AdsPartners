export const getCookie = name => {
    var cookieName = name + "=";
    var cookies = document.cookie.split(';');

    for (let cookie of cookies) {
        while (cookie.charAt(0) === ' ') {
            cookie = cookie.substring(1);
        }

        if (cookie.indexOf(cookieName) === 0) {
            return cookie.substring(cookieName.length); 
        }
    }

    return null;
};

export const deleteAllCookies = () => {
    let cookies = document.cookie.split(";");

    for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i];
        let name = cookie.substr(0, cookie.indexOf("="));
        eraseCookie(name);
    }
};

export const setJWTCookies = jwt => {
    const payload = jwt.split('.')[1];
    const jsonPayload = JSON.parse(atob(payload));
    
    setCookie('accessToken', jwt, 1);
    setCookie('username', jsonPayload.username, 1);
    setCookie('roles', jsonPayload.roles, 1);
};

const setCookie = (name, value, days) => {
    var expires = "";

    if (days) {
        let date = new Date();
        date.setDate(date.getDate() + days);
        expires = "; expires=" + date.toUTCString();
    }

    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
};

const eraseCookie = name => {   
    document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
};
