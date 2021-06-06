import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { toast } from 'react-toastify';
import { isAuthed } from '../../utils/AuthUtil';

export default props => {
    if (isAuthed()) {
        toast.error('Вече сте се автентикирали.');
        return (<Redirect to="/" />);
    }

    return (
        <Route {...props} />
    )
};
