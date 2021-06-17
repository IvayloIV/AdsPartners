import React, { useEffect, useState } from 'react';
import { useDispatch } from "react-redux";
import { Redirect } from 'react-router-dom';
import { Loader } from 'semantic-ui-react';
import { unsubscribeAction } from '../../actions/subscriptionActions';

export default props => {
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();

    useEffect(() => {
        (async () => {
            const companyId = props.match.params.companyId;
            await dispatch(unsubscribeAction(companyId));
            setLoading(false);
        })();
    }, []);

    if (loading) {
        return <Loader active id="loader" size="large" inline="centered" content="Зареждане..."/>;
    }

    return <Redirect to="/" />;
};
