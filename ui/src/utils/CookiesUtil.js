export const setCookie = (name, value, days) => {
    var expires = "";

    if (days) {
        let date = new Date();
        date.setDate(date.getDate() + days);
        expires = "; expires=" + date.toUTCString();
    }

    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
};

export const getCookie = name => {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');

    for(let i = 0; i < ca.length; i++) {
        var c = ca[i];

        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }

        if (c.indexOf(nameEQ) == 0) {
            return c.substring(nameEQ.length); 
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

const eraseCookie = name => {   
    document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
};