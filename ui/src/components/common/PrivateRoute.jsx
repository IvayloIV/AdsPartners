import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { toast } from 'react-toastify';
import { isAuthed, hasAnyRole } from '../../utils/AuthUtil';

export default props => {
    if (!isAuthed()) {
        toast.error('Трябва първо да влезете в профила си.');
        return (<Redirect to="/" />);
    }

    let authorities = props.authorities;
    if (!hasAnyRole(authorities)) {
        toast.error('Нямате достатъчно права за тази страница.');
        return (<Redirect to="/" />);
    }

    return (
        <Route {...props} />
    )
};
