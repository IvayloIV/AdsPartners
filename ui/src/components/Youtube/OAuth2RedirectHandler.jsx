import React from 'react';
import { Redirect } from 'react-router-dom'
import { toast } from 'react-toastify';
import { setJWTCookies } from '../../utils/CookiesUtil';

export default props => {
    const [name, token] = props.location.search.split("=");
    const hasError = name === '?error';

    if (hasError) {
        toast.error("Неуспешно влизане.");
    } else {
        setJWTCookies(token);
        toast.success("Успешно влязохте като ютубър.");
    }

    return (
        <Redirect to="/" />
    );
};
