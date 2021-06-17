import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Table, TextArea, Icon, Button, Loader } from 'semantic-ui-react';
import ApplicationTableRows from './ApplicationTableRows';
import { getYoutuberProfileAction, refreshYoutuberDataAction, getYoutuberDetailsAction } from '../../../actions/youtubeActions';
import { getApplicationsByYoutuberAction } from '../../../actions/applicationActions';
import { hasRole } from '../../../utils/AuthUtil';
import { YOUTUBER } from '../../../utils/Roles';

export default props => {
    const [loading, setLoading] = useState(true);

    const youtuberDetails = useSelector(state => state.youtube.details);
    const dispatch = useDispatch();

    useEffect(() => {
        (async () => {
            if (hasRole(YOUTUBER)) {
                await dispatch(getYoutuberProfileAction());
            } else {
                const youtuberId = props.match.params.youtuberId;
                await Promise.all([
                    dispatch(getYoutuberDetailsAction(youtuberId)),
                    dispatch(getApplicationsByYoutuberAction(youtuberId))
                ]);
            }

            setLoading(false);
        })();
    }, []);

    const updateYoutuberData = async () => {
        await dispatch(refreshYoutuberDataAction());
        await dispatch(getYoutuberProfileAction());
    };

    if (loading) {
        return <Loader active id="loader" size="large" inline="centered" content="Зареждане..."/>;
    }

    let isYoutuber = hasRole(YOUTUBER);

    return (
        <div className="youtuber-details">
            <div className="youtuber-details-info-container">
                <div className="youtuber-details-img-container">
                    <img src={youtuberDetails.profilePicture} alt="Youtuber picture" />
                </div>
                <h2>{youtuberDetails.name}</h2>
                <h3>{youtuberDetails.email}</h3>
                <div className="youtuber-details-description">
                    <h4>Описание:</h4>
                    <TextArea
                        id="youtuber-details-description-textarea"
                        value={youtuberDetails.description}
                        disabled={true} />
                </div>
                <div className="youtuber-details-info">
                    <p>Абонати - {youtuberDetails.subscriberCount}</p>
                    <p>Видеа - {youtuberDetails.videoCount}</p>
                    <p>Показвания - {youtuberDetails.viewCount}</p>
                    <p>Член от {new Date(youtuberDetails.publishedAt).toLocaleDateString()}</p>
                    <p>Обновен на {new Date(youtuberDetails.updateDate).toLocaleString()}</p>
                </div>
                <div className="youtuber-details-buttons">
                    {isYoutuber && <Button color='orange'
                        className="medium"
                        id="youtuber-details-refresh"
                        onClick={updateYoutuberData}>
                            <Icon name="refresh"/> Обнови
                    </Button>}
                    <Button color='youtube'
                        className="medium"
                        id="youtuber-details-show-channel"
                        as="a"
                        href={'https://www.youtube.com/channel/' + youtuberDetails.channelId} target="_blank">
                            <Icon name='youtube' /> Виж в YouTube
                    </Button>
                </div>
            </div>
            <div className="youtuber-details-applications">
                <h2>{`История на предложенията за партнюрства${!isYoutuber ? ' към Вас' : ''}`}</h2>
                <Table color="orange">
                    <Table.Header>
                        <Table.Row textAlign="center">
                            <Table.HeaderCell>Снимка на обявата</Table.HeaderCell>
                            <Table.HeaderCell>Заглавие на обявата</Table.HeaderCell>
                            <Table.HeaderCell>Дата на кандидатстване</Table.HeaderCell>
                            <Table.HeaderCell>Описание</Table.HeaderCell>
                            <Table.HeaderCell>Възнаграждение</Table.HeaderCell>
                            <Table.HeaderCell>Детайли на обявата</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <ApplicationTableRows />
                </Table>
            </div>
        </div>
    );
};
