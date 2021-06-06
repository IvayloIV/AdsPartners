import React, { Component } from 'react';
import SliderBox from '../common/SliderBox';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getYoutuberProfileAction, refreshUserDataAction, getYoutuberDetailsAction } from '../../actions/youtubeActions';
import { getYoutuberApplicationAction } from '../../actions/adActions';
import { hasRole } from '../../utils/AuthUtil';
import { YOUTUBER } from '../../utils/Roles';

class YoutuberDetails extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: true
        };
    }

    async componentDidMount() {
        try {
            if (hasRole(YOUTUBER)) {
                await this.props.loadYoutuberProfile();
            } else {
                const youtuberId = this.props.match.params.youtuberId;
                await this.props.getYoutuberDetails(youtuberId);
                await this.props.getYoutuberApplication(youtuberId);
            }

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
        
        const isYoutuber = hasRole(YOUTUBER);
        let youtuberDetails = this.props.youtuber;
        let adApplicationList = null;

        if (isYoutuber) {
            adApplicationList = this.props.youtuber.adApplicationList;
        } else {
            adApplicationList = this.props.applications;
        }

        let youtuberSentAds = adApplicationList.filter(a => a.type == 'YOUTUBER_SENT').map(a => (
            <div className="application" key={a.id}>
                <img src={a.ad.pictureUrl} alt="company-logo" width="50px" height="30px"/>
                <h3>{a.ad.title}</h3>
                <p>Reward - {a.ad.reward}</p>
                <p>Application data - {a.applicationDate}</p>
                <p>Description - {a.description}</p>
            </div>
        ));

        let companySentAds = adApplicationList.filter(a => a.type == 'COMPANY_SENT').map(a => (
            <div className="application" key={a.id}>
                <img src={a.ad.pictureUrl} alt="company-logo" width="50px" height="30px"/>
                <h3>{a.ad.title}</h3>
                <p>Reward - {a.ad.reward}</p>
                <p>Application data - {a.applicationDate}</p>
                <p>Description - {a.description}</p>
            </div>
        ));

        return (
            <div className="youtuber-details">
                <div>
                    <img src={youtuberDetails.profilePicture} alt="youtuberPicture" width="250px" height="200px" />
                    <h2>{youtuberDetails.name}</h2>
                    <p>{youtuberDetails.email}</p>
                    <p>Subscribers - {youtuberDetails.subscriberCount}</p>
                    <p>Videos - {youtuberDetails.videoCount}</p>
                    <p>Views - {youtuberDetails.viewCount}</p>
                    <p>Description - {youtuberDetails.description}</p>
                    <p>Published at - {youtuberDetails.publishedAt}</p>
                    <p>Average rating - {youtuberDetails.averageRating}</p>
                    <a href={'https://www.youtube.com/channel/' + youtuberDetails.channelId} target="_blank">View Channel</a>
                    {isYoutuber && <button onClick={async () => {
                        await this.props.refreshUserData();
                        await this.props.loadYoutuberProfile();
                    }}>Update info</button>}
                    {!isYoutuber && <Link className="offer-partnership" to={`/youtuber/offer/${youtuberDetails.id}`}>Offer partnership</Link>}
                </div>
                <div>
                    <h2>{isYoutuber ? 'You applications:' : 'Application send to you:'}</h2>
                    <SliderBox boxes={youtuberSentAds}></SliderBox>
                </div>
                <div>
                    <h2>{isYoutuber ? 'Companies that offer partnership to you:' : 'Your offers for partnership:'}</h2>
                    <SliderBox boxes={companySentAds}></SliderBox>
                </div>
            </div>
        )
    }
}

function mapState(state) {
    return {
        youtuber: state.youtube.details,
        applications: state.ad.applications
    };
}

function mapDispatch(dispatch) {
    return {
        loadYoutuberProfile: () => dispatch(getYoutuberProfileAction()),
        refreshUserData: () => dispatch(refreshUserDataAction()),
        getYoutuberDetails: (youtuberId) => dispatch(getYoutuberDetailsAction(youtuberId)),
        getYoutuberApplication: (youtuberId) => dispatch(getYoutuberApplicationAction(youtuberId)),
    };
}

export default withRouter(connect(mapState, mapDispatch)(YoutuberDetails));