import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Loader } from 'semantic-ui-react';
import { getSubscribersAction, updateSubscriberStatusAction } from '../../actions/subscriptionActions';
import YoutuberCard from './YoutuberCard';

export default () => {
    const [tabValue, setTabValue] = useState(0);
    const [loading, setLoading] = useState(true);

    const subscribers = useSelector(state => state.subscription.list);
    const dispatch = useDispatch();

    useEffect(() => {
        (async () => {
            await dispatch(getSubscribersAction())
            setLoading(false);
        })();
    }, []);

    const onChangeStatus = async (e, youtuberId) => {
        const result = await dispatch(updateSubscriberStatusAction(youtuberId, e.target.checked));
        if (result != null) {
            setTabValue((tabValue + 1) % 2);
        }
    };

    if (loading) {
        return <Loader active id="loader" size="large" inline="centered" content="Зареждане..."/>;
    }

    return (
        <div className="company-subscribers">
            <div className="company-subscribers-title">
                <h2>Вашите абонати</h2>
            </div>
            <div className="company-subscribers-buttons">
                <div onClick={() => setTabValue(0)}>
                    Разрешени абонаменти
                </div>
                <div onClick={() => setTabValue(1)}>
                    Забранени абонаменти
                </div>
            </div>
            <div className={`subscribers-wrapper ${tabValue === 0 ? 'allowed-active': 'banned-active'}`}>
                    <div className="subscribers-inner-wrapper">
                        {subscribers.filter(s => tabValue === 0 ? !s.isBlocked : s.isBlocked)
                                .map(s =>
                            <YoutuberCard
                                key={s.youtuber.id}
                                subscriber={s}
                                onChangeStatus={onChangeStatus}
                            />
                        )}
                    </div>
            </div>
        </div>
    );
};
