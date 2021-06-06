import React from 'react';
import { useDispatch } from "react-redux";
import { NavLink } from "react-router-dom";
import { Button, Rating } from 'semantic-ui-react';
import Switch from '@material-ui/core/Switch';
import { blockAdAction, unblockAdAction } from '../../actions/adActions';

export default props => {
    const a = props.ad;
    const outOfDate = new Date(a.validTo) - new Date() < 0;

    const dispatch = useDispatch();

    return (
        <div key={a.id} className="company-ad-block-container">
            <div className="company-ad-img">
                <img src={a.pictureUrl} id={outOfDate ? 'company-ad-out-of-date' : ''} alt="Ad picture"/>
                {outOfDate && <span className="company-ad-out-of-date-text">Обявата е изтекла</span>}
            </div>
            <div className="company-ad-block-info">
                <h3>{a.title}</h3>
                <span>
                    <Rating icon='star'
                        disabled={true}
                        size='huge'
                        defaultRating={Math.round(a.averageRating)}
                        maxRating={5} /> 
                    <span className="rating-info">({a.averageRating})</span>
                </span>
                <div>Възнаграждение: {a.reward} &euro;</div>
                <div>Валидна до: {new Date(a.validTo).toLocaleDateString()}</div>
                <div id="copmany-block-buttons">
                    <div className="copmany-block-button">
                        <span>Блокирана:</span>
                        <Switch
                            checked={a.isBlocked}
                            disabled={outOfDate}
                            onChange={e => {
                                if (e.target.checked) {
                                    dispatch(blockAdAction(a.id));
                                } else {
                                    dispatch(unblockAdAction(a.id));
                                }
                            }}
                            color="primary"
                        />
                    </div>
                    <Button inverted 
                        color='orange'
                        id="company-details-button"
                        as={NavLink}
                        to={`/ad/details/${a.id}`}>
                        Детайли
                    </Button>
                </div>
            </div>
        </div>
    );
};
