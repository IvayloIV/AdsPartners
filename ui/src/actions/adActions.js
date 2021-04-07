import { toast } from 'react-toastify';
import { CREATE_AD } from '../actions/actionTypes';
import { createAd } from '../services/adService';

function createAdAction(title, shortDescription, reward, validTo, minVideos, minSubscribers, minViews, picture, characteristics) {
    return (dispatch) => {
        return createAd(title, shortDescription, reward, validTo, minVideos, minSubscribers, minViews, picture, characteristics)
            .then(json => {
                console.log(json);
                dispatch({ type: CREATE_AD, data: json });
                let msg = null;
                toast.success(`${msg || 'Ad created'} successfully.`);
            });
    };
}

export { createAdAction };