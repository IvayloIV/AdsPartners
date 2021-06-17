import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Redirect } from 'react-router-dom'
import { toast } from 'react-toastify';
import { Loader } from 'semantic-ui-react';
import { loadUserInfoAction } from '../../actions/youtubeActions';
import { setCookie } from '../../utils/CookiesUtil';

export default props => {
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();

    const [name, token] = props.location.search.split("=");
    const hasError = name === '?error';

    useEffect(() => {
        (async () => {
            if (!hasError) {
                setCookie("accessToken", token, 1);
                await dispatch(loadUserInfoAction())
                setLoading(false);
            }
        })();
    }, []);

    if (loading && !hasError) {
        return <Loader active id="loader" size="large" inline="centered" content="Зареждане..."/>;
    }

    if (hasError) {
        toast.error("Неуспешно влизане.");
    } else {
        toast.success("Успешно влязохте като ютубър.");
    }

    return (
        <Redirect to="/" />
    );
};
