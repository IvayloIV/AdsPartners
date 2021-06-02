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
    const [shortDescription, setShortDescription] = useState('');
    const [reward, setReward] = useState('');
    const [validTo, setValidTo] = useState('');
    const [minVideos, setMinVideos] = useState('');
    const [minSubscribers, setMinSubscribers] = useState('');
    const [minViews, setMinViews] = useState('');
    const [picture, setPicture] = useState(null);
    const [characteristics, setCharacteristics] = useState([]);

    const [titleValidation, setTitleValidation] = useState('');
    const [shortDescriptionValidation, setShortDescriptionValidation] = useState('');
    const [rewardValidation, setRewardValidation] = useState('');
    const [validToValidation, setValidToValidation] = useState('');
    const [minVideosValidation, setMinVideosValidation] = useState('');
    const [minSubscribersValidation, setMinSubscribersValidation] = useState('');
    const [minViewsValidation, setMinViewsValidation] = useState('');
    const [pictureValidation, setPictureValidation] = useState('');
    
    const dispatch = useDispatch();

    const onChangeHandler = (e, setValue, setValidation) => {
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

    const onSubmitHandler = () => {
        const params = { title, shortDescription, reward, validTo, minVideos, minSubscribers, minViews, picture, characteristics };

        dispatch(createAdAction(params))
            .then(json => {
                if (json !== null) {
                    props.history.push("/");
                }
            })
    };

    const checkForErrors = () => {
        let haveError = false;

        haveError = validateField('title', title, setTitleValidation) || haveError;
        haveError = validateField('shortDescription', shortDescription, setShortDescriptionValidation) || haveError;
        haveError = validateField('reward', reward, setRewardValidation) || haveError;
        haveError = validateField('validTo', validTo, setValidToValidation) || haveError;
        haveError = validateField('minVideos', minVideos, setMinVideosValidation) || haveError;
        haveError = validateField('minSubscribers', minSubscribers, setMinSubscribersValidation) || haveError;
        haveError = validateField('minViews', minViews, setMinViewsValidation) || haveError;
        haveError = validateField('picture', picture, setPictureValidation) || haveError;

        if (haveError) {
            toast.error('Поправете грешките в полетата.');
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
                <h1>Създаване на рекламна обява</h1>
                <form onSubmit={onSubmitHandler}>
                    <div className="ad-form-field">
                        <TextField 
                            label="Заглавие"
                            value={title}
                            name="title"
                            onChange={e => onChangeHandler(e, setTitle, setTitleValidation)}
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
                            value={shortDescription}
                            name="shortDescription"
                            onChange={e => onChangeHandler(e, setShortDescription, setShortDescriptionValidation)}
                        />
                        <span>{shortDescriptionValidation}</span>
                    </div>
                    <div className="ad-form-field">
                        <TextField
                            type="number"
                            step="0.01"
                            label="Възнаграждение"
                            value={reward}
                            name="reward"
                            onChange={e => onChangeHandler(e, setReward, setRewardValidation)}
                        />
                        <p>&euro;</p>
                        <span>{rewardValidation}</span>
                    </div>
                    <div className="ad-form-field">
                        <TextField
                            type="date"
                            label="Валидна до"
                            value={validTo}
                            onChange={e => onChangeHandler(e, setValidTo, setValidToValidation)}
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
                            onChange={e => onChangeHandler(e, setMinVideos, setMinVideosValidation)}
                        />
                        <span>{minVideosValidation}</span>
                    </div>
                    <div className="ad-form-field">
                        <TextField
                            type="number"
                            label="Минимален брой абонати"
                            value={minSubscribers}
                            name="minSubscribers"
                            onChange={e => onChangeHandler(e, setMinSubscribers, setMinSubscribersValidation)}
                        />
                        <span>{minSubscribersValidation}</span>
                    </div>
                    <div className="ad-form-field">
                        <TextField
                            type="number"
                            label="Минимален брой зрители"
                            value={minViews}
                            name="minViews"
                            onChange={e => onChangeHandler(e, setMinViews, setMinViewsValidation)}
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
                            <span className="ad-form-picture-value">{picture === null ? 'Снимка' : picture.name}</span>
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
                            buttonAgree='Създай'
                            buttonDisagree='Отказване'
                            dialogContent='Наистина ли искате да създадете рекламнaта обява ?'
                        />
                    </div>
                </form>
            </div>
        </div>
    );
};

/*class CreateAd extends Component {
    constructor(props) {
        super(props);

        this.state = {
            title: '',
            shortDescription: '',
            reward: 0,
            validTo: '',
            minVideos: 0,
            minSubscribers: 0,
            minViews: 0,
            picture: null,
            characteristics: []
        };

        this.onChangeHandler = this.onChangeHandler.bind(this);
        this.onChangeHandlerImage = this.onChangeHandlerImage.bind(this);
        this.onSubmitHandler = this.onSubmitHandler.bind(this);
        this.onSubmitCharHandler = this.onSubmitCharHandler.bind(this);
    }

    onChangeHandler(e) {
        this.setState({ [e.target.name]: e.target.value });
    }

    onChangeHandlerImage(e) {
        this.setState({ picture: e.target.files[0] });
    }

    onSubmitHandler(e) {
        e.preventDefault();
        const { title, shortDescription, reward, validTo, minVideos, minSubscribers, minViews, picture, characteristics } = this.state;

        // Validations
        this.props.createAd(title, shortDescription, reward, validTo, minVideos, minSubscribers, minViews, picture, characteristics)
            .then((json) => {
                //TODO:
                //if (!json.success) { 
                //    toast.error(json.message);
                //    return;
                //}
                    
                //this.props.login(this.state.email, this.state.password, 'Register');
                toast.success('Ad created successfully.');
                this.props.history.push("/");
            });
    }

    onSubmitCharHandler(e, name, value) {
        e.preventDefault();
        let characteristics = this.state.characteristics.slice();
        characteristics.push({ name, value });
        this.setState({ characteristics });
    }

    onClickRemoveChar(e, index) {
        let characteristics = this.state.characteristics.slice();
        characteristics.splice(index, 1);
        this.setState({ characteristics });
    }

    render() {
        console.log(this.state.characteristics);
        return (
            <div className="container">
                <h1>Create ad</h1>
                <form onSubmit={this.onSubmitHandler}>
                    <Input
                        name="title"
                        value={this.state.title}
                        onChange={this.onChangeHandler}
                        label="Title"
                    />
                    <Input
                        name="shortDescription"
                        value={this.state.shortDescription}
                        onChange={this.onChangeHandler}
                        label="Short description"
                    />
                    <Input
                        name="reward"
                        type="number"
                        value={this.state.reward}
                        onChange={this.onChangeHandler}
                        label="Reward"
                    />
                    <Input
                        name="validTo"
                        type="date"
                        value={this.state.validTo}
                        onChange={this.onChangeHandler}
                        label="Valid to"
                    />
                    <Input
                        name="minVideos"
                        type="number"
                        value={this.state.minVideos}
                        onChange={this.onChangeHandler}
                        label="Min videos"
                    />
                    <Input
                        name="minSubscribers"
                        type="number"
                        value={this.state.minSubscribers}
                        onChange={this.onChangeHandler}
                        label="Min subscribers"
                    />
                    <Input
                        name="minViews"
                        type="number"
                        value={this.state.minViews}
                        onChange={this.onChangeHandler}
                        label="Min views"
                    />
                    <Input
                        name="picture"
                        type="file"
                        onChange={this.onChangeHandlerImage}
                        label="Picture"
                    />
                    <div>
                        {this.state.characteristics.map((c, i) =>
                          <div key={i}>
                            <span>{c.name + " - " + c.value}</span>
                            <span onClick={e => this.onClickRemoveChar(e, i)}>Remove</span>
                          </div>
                        )}
                    </div>
                    <CreateCharacteristic
                        onSubmitCharHandler={this.onSubmitCharHandler}
                    />
                    <input type="submit" value="Create" />
                </form>
            </div>
        );
    }
}

function mapDispatch(dispatch) {
    return {
        createAd: (title, shortDescription, reward, validTo, minVideos, minSubscribers, minViews, picture, characteristics) => 
            dispatch(createAdAction(title, shortDescription, reward, validTo, minVideos, minSubscribers, minViews, picture, characteristics))
    };
}

export default withRouter(connect(null, mapDispatch)(CreateAd));*/