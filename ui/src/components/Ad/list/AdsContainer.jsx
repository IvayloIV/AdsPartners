import React from 'react';
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from 'react-router-dom';
import { Rating, Button, Icon } from 'semantic-ui-react';
import { voteForAdAction } from '../../../actions/adActions';

export default props => {
    const ads = useSelector(state => state.ad.list);
    const dispatch = useDispatch();

    const voteForAdHandler = async (adId, rating) => { 
        await dispatch(voteForAdAction(adId, rating));
        props.refreshAds();
    };

    return (
        <div className="ad-list-items">
            {ads.totalElements === 0 &&
                <div className="ad-list-not-found">Не са намерени обяви по зададените критерий.</div>}
            {ads.items.map(a => {
                const outOfDate = new Date(a.validTo) - new Date() < 0;

                return (<div key={a.id} className="ad-list-item-wrapper">
                    <div className="ad-list-img-wrapper">
                        <img src={a.pictureUrl} alt="Ad picture" className={outOfDate ? "ad-list-item-expired" : ''} />
                        {outOfDate && <div>Обявата е изтекла</div>}
                    </div>
                    <h2>{a.title}</h2>
                    <div className="ad-list-rating">
                        <Rating 
                            maxRating={5} 
                            defaultRating={a.ratingResponse != null ? a.ratingResponse.rating : 0} 
                            disabled={a.ratingResponse != null || outOfDate}
                            onRate={(e, v) => voteForAdHandler(a.id, v.rating)}
                            icon='star'
                            size="huge"
                        /> <span className="ad-list-rating-text">({Number(a.averageRating.toFixed(2))})</span>
                    </div>
                    <h3>Възнаграждение: {a.reward} &euro;</h3>
                    <div className="ad-list-requirements">
                        <h4>Минимален брой:</h4>
                        <ul>
                            <li>видеа - {a.minVideos || 0}</li>
                            <li>абонати - {a.minSubscribers || 0}</li>
                            <li>показвания - {a.minViews || 0}</li>
                        </ul>
                    </div>
                    <div className="ad-list-date">
                        <Icon name="clock outline" /> 
                        Дата на създаване: <span>{new Date(a.creationDate).toLocaleDateString()}</span></div>
                    <div className="ad-list-date">
                        <Icon name="clock outline" /> 
                        Валидна до: <span>{new Date(a.validTo).toLocaleDateString()}</span>
                    </div>
                    <div className="ad-list-details">
                        <Button inverted 
                            color='orange'
                            as={NavLink}
                            to={`/ad/details/${a.id}`}>
                            <Icon name="briefcase" /> Детайли
                        </Button>
                    </div>
                </div>);
            })}
        </div>
    );
};
