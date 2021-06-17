import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { toast } from 'react-toastify';
import { TextField, IconButton } from '@material-ui/core';
import PhotoCamera from '@material-ui/icons/PhotoCamera';
import { Loader } from 'semantic-ui-react';
import CharacteristicList from '../Characteristic/CharacteristicList';
import CreateCharacteristic from '../Characteristic/CreateCharacteristic';
import Dialog from '../common/Dialog';
import * as validations from '../../validations/ad';
import { getAdDetailsAction, editAdAction } from '../../actions/adActions';

export default props => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [reward, setReward] = useState('');
    const [validTo, setValidTo] = useState('');
    const [minVideos, setMinVideos] = useState('');
    const [minSubscribers, setMinSubscribers] = useState('');
    const [minViews, setMinViews] = useState('');
    const [currPicture, setCurrPicture] = useState(null);
    const [picture, setPicture] = useState(null);
    const [characteristics, setCharacteristics] = useState([]);
    const [loading, setLoading] = useState(true);

    const [titleValidation, setTitleValidation] = useState('');
    const [descriptionValidation, setDescriptionValidation] = useState('');
    const [rewardValidation, setRewardValidation] = useState('');
    const [validToValidation, setValidToValidation] = useState('');
    const [minVideosValidation, setMinVideosValidation] = useState('');
    const [minSubscribersValidation, setMinSubscribersValidation] = useState('');
    const [minViewsValidation, setMinViewsValidation] = useState('');
    
    const ad = useSelector(state => state.ad.details);
    const dispatch = useDispatch();

    useEffect(() => {
        (async () => {
            const adId = props.match.params.adId;
            const initAd = await dispatch(getAdDetailsAction(adId));

            setTitle(initAd.title);
            setDescription(initAd.description);
            setReward(initAd.reward);
            setValidTo(new Date(initAd.validTo).toISOString().slice(0, 10));
            setMinVideos(initAd.minVideos);
            setMinSubscribers(initAd.minSubscribers);
            setMinViews(initAd.minViews);
            setCurrPicture(initAd.pictureUrl);
            setCharacteristics(initAd.characteristics);
            setLoading(false);
        })();
    }, []);

    const onChangeInputHandler = (e, setValue, setValidation) => {
        const name = e.target.name;
        const value = e.target.value;

        if (setValidation !== null) {
            setValidation(validations[name](value));
        }
        setValue(value);
    };

    const onChangeHandlerImage = e => {
        setPicture(e.target.files[0]);
    };

    const onSubmitCharHandler = (e, name, value) => {
        let copyCharacteristics = characteristics.slice();
        copyCharacteristics.push({ name, value });
        setCharacteristics(copyCharacteristics);
    };

    const onClickRemoveChar = (e, index) => {
        let copyCharacteristics = characteristics.slice();
        copyCharacteristics.splice(index, 1);
        setCharacteristics(copyCharacteristics);
    };

    const onSubmitHandler = async () => {
        const params = { title, description, reward, validTo, minVideos, minSubscribers, minViews, picture, characteristics };

        const json = await dispatch(editAdAction(ad.id, params));
        if (json !== null) {
            props.history.push("/");
        }
    };

    const checkForErrors = () => {
        let haveError = false;

        haveError = validateField('title', title, setTitleValidation) || haveError;
        haveError = validateField('description', description, setDescriptionValidation) || haveError;
        haveError = validateField('reward', reward, setRewardValidation) || haveError;
        haveError = validateField('validTo', validTo, setValidToValidation) || haveError;
        haveError = validateField('minVideos', minVideos, setMinVideosValidation) || haveError;
        haveError = validateField('minSubscribers', minSubscribers, setMinSubscribersValidation) || haveError;
        haveError = validateField('minViews', minViews, setMinViewsValidation) || haveError;

        if (haveError) {
            toast.error('Поправете грешките в полетата.');
            return true;
        }
        return false;
    };

    const validateField = (name, value, setValidation) => {
        let validationValue = validations[name](value);
        setValidation(validationValue);
        return validationValue !== '';
    };

    if (loading) {
        return <Loader active id="loader" size="large" inline="centered" content="Зареждане..."/>;
    }

    return (
        <div className="ad-form-container">
            <div className="ad-form">
                <h1>Редактиране на обявата</h1>
                <form onSubmit={onSubmitHandler}>
                    <div className="ad-form-field">
                        <TextField 
                            label="Заглавие"
                            value={title}
                            name="title"
                            onChange={e => onChangeInputHandler(e, setTitle, setTitleValidation)}
                        />
                        <span>{titleValidation}</span>
                    </div>
                    <div className="ad-form-field">
                        <TextField
                            id="standard-multiline-static"
                            multiline
                            rowsMax={4}
                            rows={4}
                            label="Кратко описание"
                            value={description}
                            name="description"
                            onChange={e => onChangeInputHandler(e, setDescription, setDescriptionValidation)}
                        />
                        <span>{descriptionValidation}</span>
                    </div>
                    <div className="ad-form-field">
                        <TextField
                            type="number"
                            step="0.01"
                            label="Възнаграждение"
                            value={reward}
                            name="reward"
                            onChange={e => onChangeInputHandler(e, setReward, setRewardValidation)}
                        />
                        <p>&euro;</p>
                        <span>{rewardValidation}</span>
                    </div>
                    <div className="ad-form-field">
                        <TextField
                            type="date"
                            label="Валидна до"
                            value={validTo}
                            onChange={e => onChangeInputHandler(e, setValidTo, setValidToValidation)}
                            name="validTo"
                            InputLabelProps={{
                                shrink: true
                            }}
                        />
                        <span>{validToValidation}</span>
                    </div>
                    <div className="ad-form-field">
                        <TextField
                            type="number"
                            label="Минимален брой видеа"
                            value={minVideos}
                            name="minVideos"
                            onChange={e => onChangeInputHandler(e, setMinVideos, setMinVideosValidation)}
                        />
                        <span>{minVideosValidation}</span>
                    </div>
                    <div className="ad-form-field">
                        <TextField
                            type="number"
                            label="Минимален брой абонати"
                            value={minSubscribers}
                            name="minSubscribers"
                            onChange={e => onChangeInputHandler(e, setMinSubscribers, setMinSubscribersValidation)}
                        />
                        <span>{minSubscribersValidation}</span>
                    </div>
                    <div className="ad-form-field">
                        <TextField
                            type="number"
                            label="Минимален брой зрители"
                            value={minViews}
                            name="minViews"
                            onChange={e => onChangeInputHandler(e, setMinViews, setMinViewsValidation)}
                        />
                        <span>{minViewsValidation}</span>
                    </div>
                    <div className="ad-form-field">
                        <input
                            onChange={onChangeHandlerImage}
                            name="picture"
                            id="ad-form-picture"
                            type="file"
                        />
                        <h3 className="edit-curr-text">Запазена снимка:</h3>
                        <img src={currPicture} alt="Current ad image" className="edit-curr-img" />
                        <label htmlFor="ad-form-picture" className="ad-form-picture-label">
                            <IconButton color="primary" aria-label="upload picture" component="span">
                                <PhotoCamera />
                            </IconButton>
                            <span className="ad-form-picture-value">{picture === null ? 'Смени снимката' : picture.name}</span>
                        </label>
                    </div>
                    <div className="characteristics">
                        <CharacteristicList characteristics={characteristics} onClickRemoveChar={onClickRemoveChar} />
                        <CreateCharacteristic onSubmitCharHandler={onSubmitCharHandler} />
                    </div>
                    <div>
                        <Dialog
                            checkForErrors={checkForErrors}
                            onSubmitHandler={onSubmitHandler}
                            buttonAgree='Редактирай'
                            buttonDisagree='Отказване'
                            dialogContent='Наистина ли искате да редактирате рекламнaта обява ?'
                        />
                    </div>
                </form>
            </div>
        </div>
    );
};
