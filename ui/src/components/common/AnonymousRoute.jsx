import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getCookie } from '../../utils/CookiesUtil';

export default props => {
    if (getCookie('accessToken')) {
        toast.error('Вече сте се автентикирали.');
        return (<Redirect to="/" />);
    }

    return (
        <Route {...props} />
    )
};
