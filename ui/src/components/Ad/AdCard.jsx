import React from 'react';
import { useDispatch } from "react-redux";
import { NavLink } from "react-router-dom";
import { Button, Rating, Icon } from 'semantic-ui-react';
import Dialog from '../common/Dialog';
import { deleteAdAction } from '../../actions/adActions';

export default ({ ad: a, isOwner, validToText, isHidden }) => {
    const outOfDate = new Date(a.validTo) - new Date() < 0;
    const dispatch = useDispatch();

    return (
        <div key={a.id} className="company-ad-block-container">
            <div className="company-ad-img">
                <img src={a.pictureUrl} id={(outOfDate || a.isBlocked) && !isHidden ? 'company-ad-out-of-date' : ''} alt="Ad picture"/>
                {outOfDate && !isHidden && <span className="company-ad-out-of-date-text">Обявата е изтекла</span>}
                {a.isBlocked && !isHidden && <span className="company-blocked-ad-icon"><Icon name="ban" color="red" size="massive"/></span>}
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
                <div className="company-ad-valid-to">
                    {validToText || `Валидна до: ${new Date(a.validTo).toLocaleDateString()}`}
                </div>
                <div id="copmany-ad-buttons">
                    <Button inverted 
                        color='orange'
                        id="ad-details-button"
                        as={NavLink}
                        to={`/ad/details/${a.id}`}>
                        Детайли
                    </Button>
                    {isOwner && <Button inverted 
                        color='yellow'
                        id="ad-edit-button"
                        as={NavLink}
                        to={`/ad/edit/${a.id}`}>
                        <Icon name="pencil" />
                    </Button>}
                    {isOwner && <Dialog
                        checkForErrors={null}
                        onSubmitHandler={() => dispatch(deleteAdAction(a.id))}
                        buttonAgree='Изтрий'
                        iconButton='remove'
                        buttonColor='red'
                        buttonDisagree='Отказване'
                        dialogContent='Наистина ли искате да изтриете рекламнaта обява ?'
                    />}
                </div>
            </div>
        </div>
    );
};
