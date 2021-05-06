import React, { Component } from 'react';
import { toast } from 'react-toastify';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Input from '../common/Input';
import CreateCharacteristic from '../Characteristic/CreateCharacteristic';
import { getAdDetailsAction, editAdAction } from '../../actions/adActions';

class EditAd extends Component {
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
            savedPictureUrl: '',
            characteristics: [],
            loading: true
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
        const adId = this.props.match.params.adId;
        const { title, shortDescription, reward, validTo, minVideos, minSubscribers, minViews, picture, characteristics } = this.state;

        // Validations
        this.props.editAd(adId, title, shortDescription, reward, validTo, minVideos, minSubscribers, minViews, picture, characteristics)
            .then((json) => {
                //TODO:
                /*if (!json.success) { 
                    toast.error(json.message);
                    return;
                }*/
                    
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

    async componentDidMount() {
        try {
            const adId = this.props.match.params.adId;
            await this.props.loadAdDetails(adId);
            const ad = this.props.ad;

            this.setState({
                title: ad.title,
                shortDescription: ad.shortDescription,
                reward: ad.reward,
                validTo: new Date(ad.validTo).toISOString().slice(0, 10),
                minVideos: ad.minVideos,
                minSubscribers: ad.minSubscribers,
                minViews: ad.minViews,
                savedPictureUrl: ad.pictureUrl,
                characteristics: ad.characteristics,
                loading: false
            });
        } catch (err) {
            toast.error(err.message);
            // this.props.history.push('/');
        }
    }

    render() {
        if (this.state.loading) {
            return <div>{'Loading...'}</div>;
        }

        console.log(this.state.validTo);

        return (
            <div className="container">
                <h1>Edit ad</h1>
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
                    <div>
                        <h3>Saved picture:</h3>
                        <img src={this.state.savedPictureUrl} alt="Picture doesn't exist!" />
                    </div>
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
                    <input type="submit" value="Edit" />
                </form>
            </div>
        );
    }
}

function mapState(state) {
    return {
        ad: state.ad.details
    };
}

function mapDispatch(dispatch) {
    return {
        loadAdDetails: (adId) => dispatch(getAdDetailsAction(adId)),
        editAd: (adId, title, shortDescription, reward, validTo, minVideos, minSubscribers, minViews, picture, characteristics) => 
            dispatch(editAdAction(adId, title, shortDescription, reward, validTo, minVideos, minSubscribers, minViews, picture, characteristics))
    };
}

export default withRouter(connect(mapState, mapDispatch)(EditAd));