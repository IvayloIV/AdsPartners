import React, { Component } from 'react';
import { toast } from 'react-toastify';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { getAdDetailsAction, deleteAdAction } from '../../actions/adActions';

class DeleteAd extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: true
        };

        this.onSubmitHandler = this.onSubmitHandler.bind(this);
    }

    onSubmitHandler(e) {
        e.preventDefault();
        const adId = this.props.match.params.adId;

        this.props.deleteAd(adId)
            .then((json) => {
                this.props.history.push("/");
            });
    }

    async componentDidMount() {
        try {
            const adId = this.props.match.params.adId;
            await this.props.loadAdDetails(adId);
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

        const ad = this.props.ad;

        return (
            <div className="container">
                <h1>Delete ad</h1>
                <form onSubmit={this.onSubmitHandler}>
                    <h3>{ad.title}</h3>
                    <p>{ad.shortDescription}</p>
                    <ul>
                        <li>Average rating - {ad.averageRating}</li>
                        <li>Reward - {ad.reward}</li>
                        <li>Valid to - {new Date(ad.validTo).toISOString().slice(0, 10)}</li>
                        <li>Min videos - {ad.minVideos}</li>
                        <li>Min subscribers - {ad.minSubscribers}</li>
                        <li>Min views - {ad.minViews}</li>
                    </ul>
                    <h3>Characteristics:</h3>
                    <div>
                        {ad.characteristics.map((c, i) =>
                          <div key={i}>
                            <span>{c.name + " - " + c.value}</span>
                          </div>
                        )}
                    </div>
                    <div>
                        <h3>Picture:</h3>
                        <img src={ad.pictureUrl} alt="Picture doesn't exist!" />
                    </div>
                    <input type="submit" value="Delete" />
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
        deleteAd: (adId) => dispatch(deleteAdAction(adId))
    };
}

export default withRouter(connect(mapState, mapDispatch)(DeleteAd));