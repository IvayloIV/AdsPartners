import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getCookie } from '../../utils/CookiesUtil';

export default props => {
    if (!getCookie('accessToken')) {
        toast.error('First you must login.');
        return (<Redirect to="/" />);
    }

    let authorities = props.authorities;
    let userRoles = JSON.parse(getCookie('roles'));

    if (!authorities.some(e => userRoles.indexOf(e) != -1)) {
        toast.error('You don\'t have enough permissions.');
        return (<Redirect to="/" />);
    }

    return (
        <Route {...props} />
    )
};
