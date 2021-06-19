import React, { useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Button, Icon, TextArea } from 'semantic-ui-react';
import { getAdDetailsAction } from '../../../actions/adActions';
import { applyForAdAction } from '../../../actions/applicationActions';
import { getYoutuberProfileAction } from '../../../actions/youtubeActions';

export default ({ outOfDate,  haveEnoughtVideos, haveEnoughtSubs, haveEnoughtViews }) => {
    const [description, setDescription] = useState('');

    const ad = useSelector(state => state.ad.details);
    const dispatch = useDispatch();

    const onApplyForHandler = async () => {
        await dispatch(applyForAdAction(ad.id, { description }));
        dispatch(getYoutuberProfileAction());
        dispatch(getAdDetailsAction(ad.id));
    };

    return (
        <div className="ad-details-apply-for">
            <h2>Изпрати предложение за партньорство:</h2>
            {ad.isBlocked && <p className="ad-details-apply-for-validation">Рекламната обява е блокирана.</p>}
            {!ad.isBlocked && outOfDate && <p className="ad-details-apply-for-validation">Рекламната обява е изтекла.</p>}
            {(!haveEnoughtVideos || !haveEnoughtSubs || !haveEnoughtViews) && 
                <p className="ad-details-apply-for-validation">Не отговаряте на изискванията на обявата (в червено).</p>}
            {!ad.isBlocked &&  !outOfDate &&  haveEnoughtVideos &&  haveEnoughtSubs &&  haveEnoughtViews &&
            <div>
                <TextArea
                    id="ad-details-apply-for-textarea"
                    onChange={e => setDescription(e.target.value)}
                    placeholder="Съобщение до компанията" />
                <Button color='blue'
                    size="large"
                    onClick={onApplyForHandler}>
                    <Icon name="mail outline" /> Изпрати
                </Button>
            </div>}
        </div>
    );
};
