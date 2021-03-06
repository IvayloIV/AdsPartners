import React, { useState } from 'react';
import { useDispatch } from "react-redux";
import { toast } from 'react-toastify';
import { TextField, IconButton } from '@material-ui/core';
import PhotoCamera from '@material-ui/icons/PhotoCamera';
import CharacteristicList from '../Characteristic/CharacteristicList';
import CreateCharacteristic from '../Characteristic/CreateCharacteristic';
import Dialog from '../common/Dialog';
import * as validations from '../../validations/ad';
import { createAdAction } from '../../actions/adActions';

export default props => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [reward, setReward] = useState('');
    const [validTo, setValidTo] = useState('');
    const [minVideos, setMinVideos] = useState('');
    const [minSubscribers, setMinSubscribers] = useState('');
    const [minViews, setMinViews] = useState('');
    const [picture, setPicture] = useState(null);
    const [characteristics, setCharacteristics] = useState([]);

    const [titleValidation, setTitleValidation] = useState('');
    const [descriptionValidation, setDescriptionValidation] = useState('');
    const [rewardValidation, setRewardValidation] = useState('');
    const [validToValidation, setValidToValidation] = useState('');
    const [minVideosValidation, setMinVideosValidation] = useState('');
    const [minSubscribersValidation, setMinSubscribersValidation] = useState('');
    const [minViewsValidation, setMinViewsValidation] = useState('');
    const [pictureValidation, setPictureValidation] = useState('');
    
    const dispatch = useDispatch();

    const onChangeInputHandler = (e, setValue, setValidation) => {
        const name = e.target.name;
        const value = e.target.value;

        if (setValidation !== null) {
            setValidation(validations[name](value));
        }
        setValue(value);
    };

    const onChangeHandlerImage = e => {
        setPictureValidation('');
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

        const json = await dispatch(createAdAction(params))
        if (json !== null) {
            props.history.push("/company/profile");
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
        haveError = validateField('picture', picture, setPictureValidation) || haveError;

        if (haveError) {
            toast.error('?????????????????? ???????????????? ?? ????????????????.');
            return true;
        }
        return false;
    }

    const validateField = (name, value, setValidation) => {
        let validationValue = validations[name](value);
        setValidation(validationValue);
        return validationValue !== '';
    };

    return (
        <div className="ad-form-container">
            <div className="ad-form">
                <h1>?????????????????? ???? ???????????????? ??????????</h1>
                <form onSubmit={onSubmitHandler}>
                    <div className="ad-form-field">
                        <TextField 
                            label="????????????????"
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
                            label="???????????? ????????????????"
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
                            label="????????????????????????????"
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
                            label="?????????????? ????"
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
                            label="?????????????????? ???????? ??????????"
                            value={minVideos}
                            name="minVideos"
                            onChange={e => onChangeInputHandler(e, setMinVideos, setMinVideosValidation)}
                        />
                        <span>{minVideosValidation}</span>
                    </div>
                    <div className="ad-form-field">
                        <TextField
                            type="number"
                            label="?????????????????? ???????? ??????????????"
                            value={minSubscribers}
                            name="minSubscribers"
                            onChange={e => onChangeInputHandler(e, setMinSubscribers, setMinSubscribersValidation)}
                        />
                        <span>{minSubscribersValidation}</span>
                    </div>
                    <div className="ad-form-field">
                        <TextField
                            type="number"
                            label="?????????????????? ???????? ??????????????"
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
                        <label htmlFor="ad-form-picture" className="ad-form-picture-label">
                            <IconButton color="primary" aria-label="upload picture" component="span">
                                <PhotoCamera />
                            </IconButton>
                            <span className="ad-form-picture-value">{picture === null ? '????????????' : picture.name}</span>
                        </label>
                        <span>{pictureValidation}</span>
                    </div>
                    <div className="characteristics">
                        <CharacteristicList characteristics={characteristics} onClickRemoveChar={onClickRemoveChar} />
                        <CreateCharacteristic onSubmitCharHandler={onSubmitCharHandler} />
                    </div>
                    <div>
                        <Dialog
                            checkForErrors={checkForErrors}
                            onSubmitHandler={onSubmitHandler}
                            buttonAgree='????????????'
                            buttonDisagree='??????????????????'
                            dialogContent='???????????????? ???? ???????????? ???? ?????????????????? ??????????????a???? ?????????? ?'
                        />
                    </div>
                </form>
            </div>
        </div>
    );
};
