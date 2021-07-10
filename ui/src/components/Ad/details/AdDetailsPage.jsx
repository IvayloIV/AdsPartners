import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Rating, Icon, TextArea, Loader } from 'semantic-ui-react';
import AdCreatorInfo from './AdCreatorInfo';
import ApplicationFrom from './ApplicationFrom';
import ApplicationDetails from './ApplicationDetails';
import { getAdDetailsAction, voteForAdAction } from '../../../actions/adActions';
import { getApplicationsByAdAction } from '../../../actions/applicationActions';
import { getYoutuberProfileAction } from '../../../actions/youtubeActions';
import { hasRole } from '../../../utils/AuthUtil';
import { YOUTUBER } from '../../../utils/Roles';

export default props => {
    const [loading, setLoading] = useState(true);

    const ad = useSelector(state => state.ad.details);
    const youtuber = useSelector(state => state.youtube.details);
    const dispatch = useDispatch();

    useEffect(() => {
        (async () => {
            const adId = props.match.params.adId;

            let userDetailsPromise;
            if (hasRole(YOUTUBER)) {
                userDetailsPromise = dispatch(getYoutuberProfileAction());
            } else {
                userDetailsPromise = dispatch(getApplicationsByAdAction(adId));
            }

            await Promise.all([
                dispatch(getAdDetailsAction(adId)),
                userDetailsPromise
            ]);
            
            setLoading(false);
        })();
    }, []);

    const voteForAdHandler = async (adId, rating) => { 
        await dispatch(voteForAdAction(adId, rating));
        dispatch(getAdDetailsAction(adId));
    };

    if (loading) {
        return <Loader active id="loader" size="large" inline="centered" content="Зареждане..."/>;
    }

    const outOfDate = new Date(ad.validTo) - new Date() < 0;
    const isYoutuber = hasRole(YOUTUBER);
    const haveEnoughtVideos = isYoutuber && ad.minVideos <= youtuber.videoCount;
    const haveEnoughtSubs = isYoutuber && ad.minSubscribers <= youtuber.subscriberCount;
    const haveEnoughtViews = isYoutuber && ad.minViews <= youtuber.viewCount;
    const notApplied = isYoutuber && youtuber.adApplicationList.every(a => a.ad.id !== ad.id);

    return (
        <div className="ad-details">
            <h2>Детайли на рекламната обява</h2>
            <div className="ad-details-container">
                <div className="ad-details-left-container">
                    <div className="ad-details-img">
                        <img src={ad.pictureUrl} id={outOfDate || ad.isBlocked ? 'ad-details-out-of-date' : ''} alt="Ad img"/>
                        {!ad.isBlocked && outOfDate && <span className="ad-details-out-of-date-text">Обявата е изтекла</span>}
                        {ad.isBlocked && <span className="ad-details-blocked-icon">
                            <Icon name="ban" color="red" id="ad-details-blocked-ban-icon" size="massive"/>
                        </span>}
                    </div>
                    <h2>{ad.title}</h2>
                    <div className="ad-details-rating">
                        <Rating 
                            maxRating={5} 
                            defaultRating={isYoutuber ? (ad.ratingResponse != null ? ad.ratingResponse.rating : 0) : Math.round(ad.averageRating)}
                            disabled={!isYoutuber || ad.ratingResponse != null || outOfDate || ad.isBlocked}
                            onRate={(e, v) => voteForAdHandler(ad.id, v.rating)}
                            icon='star'
                            size="huge"
                        /> <span className="ad-list-rating-text">({ad.averageRating.toFixed(2)})</span>
                    </div>
                    <h3>Възнаграждение: {ad.reward} &euro;</h3>
                    <h3>Брой кандидати за обявата досега: {ad.applicationCount}</h3>
                    <div className="ad-details-requirements">
                        <h4>Минимален брой:</h4>
                        <ul>
                            <li>видеа - {ad.minVideos || 0}
                                {!haveEnoughtVideos && isYoutuber ? <span className="ad-details-yotuber-diff">{` - още ${ad.minVideos - youtuber.videoCount} ви трябват`}</span> : ''}
                            </li>
                            <li>абонати - {ad.minSubscribers || 0}
                                {!haveEnoughtSubs && isYoutuber ? <span className="ad-details-yotuber-diff">{` - още ${ad.minSubscribers - youtuber.subscriberCount} ви трябват`}</span> : ''}
                            </li>
                            <li>показвания - {ad.minViews || 0}
                                {!haveEnoughtViews && isYoutuber ? <span className="ad-details-yotuber-diff">{` - още ${ad.minViews - youtuber.viewCount} ви трябват`}</span> : ''}
                            </li>
                        </ul>
                    </div>
                    <div className="ad-details-date">
                        <Icon name="clock outline" /> 
                        Дата на създаване: <span>{new Date(ad.creationDate).toLocaleDateString()}</span></div>
                    <div className="ad-details-date">
                        <Icon name="clock outline" /> 
                        Валидна до: <span>{new Date(ad.validTo).toLocaleDateString()}</span>
                    </div>
                    <div className="ad-details-description">
                        <h3>Описание:</h3>
                        <TextArea
                            id="ad-details-description-textarea"
                            value={ad.description}
                            disabled={true} />
                    </div>
                    {ad.characteristics.length > 0 && 
                    <div className="ad-details-characteristics">
                        <h3>Допълнителни характеристики:</h3>
                        <ul>
                            {ad.characteristics.map(c => <li key={c.id}>{c.name + ' - ' + c.value}</li>)}
                        </ul>
                    </div>}
                </div>
                <div className="ad-details-right-container">
                    <AdCreatorInfo />
                    {notApplied && 
                        <ApplicationFrom 
                            outOfDate={outOfDate}
                            haveEnoughtVideos={haveEnoughtVideos}
                            haveEnoughtSubs={haveEnoughtSubs}
                            haveEnoughtViews={haveEnoughtViews}
                        />
                    }
                </div>
            </div>
            <ApplicationDetails />
        </div>
    );
};
