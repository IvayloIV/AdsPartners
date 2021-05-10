import React, { Component } from 'react';
import SliderBox from '../common/SliderBox';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getCompanyAdsAction } from '../../actions/adActions';
import { offerPartnershipAction } from '../../actions/companyActions';


class OfferPartnership extends Component {
    constructor(props) {
        super(props);

        this.state = {
            description: '',
            adId: '',
            loading: true
        };

        this.onChangeHandler = this.onChangeHandler.bind(this);
        this.onSubmitHandler = this.onSubmitHandler.bind(this);
        this.onChangeAdId = this.onChangeAdId.bind(this);
    }

    onChangeHandler(e) {
        this.setState({ [e.target.name]: e.target.value });
    }

    onChangeAdId(adId) {
        this.setState({ adId });
    }

    onSubmitHandler(e) {
        e.preventDefault();
        const { description, adId } = this.state;
        const youtuberId = this.props.match.params.youtuberId;

        this.props.offerPartnership(adId, youtuberId, description)
            .then(json => {
                if (json != null) {
                    this.props.history.push("/");
                }
            });
    }

    async componentDidMount() {
        try {
            await this.props.getCompanyAds();
            this.setState({ loading: false });
        } catch (err) {
            toast.error(err.message);
            // this.props.history.push('/');
        }
    }

    render() {
        if (this.state.loading) {
            return <div>{'Loading...'}</div>;
        }
        
        const ads = this.props.ads.items;

        let adsBoxes = ads.filter(a => !a.isBlocked && new Date(a.validTo) - new Date() > 0).map(a => (
            <div className="ad-info" key={a.id}>
                <img src={a.pictureUrl} alt="company-logo" width="50px" height="30px"/>
                <h3>{a.title} ({a.averageRating})</h3>
                <h4>{a.validTo}</h4>
            </div>
        ));

        return (
            <div className="company-offer">
                <div>
                    <h2>Your ads:</h2>
                    <SliderBox boxes={adsBoxes} onChangeAdId={this.onChangeAdId}></SliderBox>
                </div>
                <div>
                    <form onSubmit={this.onSubmitHandler}>
                        <TextField
                            id="outlined-multiline-static"
                            label="Description"
                            multiline
                            rows={4}
                            name="description"
                            value={this.state.description}
                            onChange={this.onChangeHandler}
                            variant="outlined"
                        />
                        <Button 
                            type="submit"
                            variant="contained" 
                            color="primary">
                            Send
                        </Button>
                    </form>
                </div>
            </div>
        )
    }
}

function mapState(state) {
    return {
        ads: state.ad.list
    };
}

function mapDispatch(dispatch) {
    return {
        getCompanyAds: () => dispatch(getCompanyAdsAction()),
        offerPartnership: (adId, youtuberId, description) => 
            dispatch(offerPartnershipAction(adId, youtuberId, description))
    };
}

export default withRouter(connect(mapState, mapDispatch)(OfferPartnership));