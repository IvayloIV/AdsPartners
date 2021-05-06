import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Button from '@material-ui/core/Button';
import { getCompanyAdsAction, getApplicationsByCompanyAction, getCompanyAdsByIdAction } from '../../actions/adActions';
import { getCompanyDetailsAction, getCompanyProfileAction } from '../../actions/companyActions';
import { checkSubscriptionAction, subscribeAction } from '../../actions/youtubeActions';

class CompanyDetailsPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: true
        };
    }

    async componentDidMount() {
        try {
            const companyId = this.props.match.params.companyId;
            if (companyId) {
                await this.props.getCompanyAdsById(companyId);
                await this.props.getCompanyDetails(companyId);
            } else {
                await this.props.getCompanyAds();
                await this.props.getCompanyProfile();
            }

            const userRoles = JSON.parse(localStorage.getItem("roles"));
            const isYoutuber = userRoles != null && userRoles.some(e => e == 'YOUTUBER');

            if (isYoutuber) {
                await this.props.getApplicationsByCompany(companyId);
                await this.props.checkSubscription(companyId);
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
        
        const companyDetails = this.props.companyDetails;
        const ads = this.props.ads.items;
        const applications = this.props.applications;

        console.log(applications);

        const userRoles = JSON.parse(localStorage.getItem("roles"));
        const isYoutuber = userRoles != null && userRoles.some(e => e == 'YOUTUBER');
        const isAdmin = userRoles != null && userRoles.some(e => e == 'ADMIN');
        const isEmployer = userRoles != null && userRoles.some(e => e == 'EMPLOYER');

        return (
            <div className="company-details">
                <h2>Company:</h2>
                <img src={companyDetails.logoUrl} alt="companyLogo" width="150px" height="100px"/>
                <p>Name - {companyDetails.userName}</p>
                <p>Email - {companyDetails.userEmail}</p>
                <p>Workers count - {companyDetails.workersCount}</p>
                {(isYoutuber && !this.props.isSubscriber) && 
                    <Button 
                        variant="contained" 
                        color="primary"
                        onClick={() => this.props.subscribe(companyDetails.id)}>
                        Subscribe
                    </Button>}
                <h2>Available ads</h2>
                {ads.filter(a => !a.isBlocked && new Date(a.validTo) - new Date() > 0).map(a => (
                    <div key={a.id}>
                        <p>Title - {a.title}</p>
                        <p>Valid to - {a.validTo}</p>
                        {isEmployer && <p><Link className="ad-edit" to={`/ad/edit/${a.id}`}>Edit</Link></p>}
                        {/* TODO: check if owner is log in for edit ad */}
                    </div>
                ))}
                {(isAdmin  || isEmployer) && <h2>Out of date ads</h2>}
                {(isAdmin  || isEmployer) && 
                    ads.filter(a => !a.isBlocked && new Date(a.validTo) - new Date() <= 0).map(a => (
                    <div key={a.id}>
                        <p>Title - {a.title}</p>
                        <p>Valid to - {a.validTo}</p>
                    </div>
                ))}
                {(isAdmin  || isEmployer) && <h2>Blocked ads</h2>}
                {(isAdmin  || isEmployer) && 
                    ads.filter(a => a.isBlocked).map(a => (
                    <div key={a.id}>
                        <p>Title - {a.title}</p>
                        <p>Valid to - {a.validTo}</p>
                    </div>
                ))}
                {isYoutuber && <h2>Your applications sent:</h2>}
                {isYoutuber && 
                    applications.filter(a => a.type === 'YOUTUBER_SENT').map(a => (
                    <div key={a.ad.id}>
                        <p>Title - {a.ad.title}</p>
                        <p>Reward - {a.ad.reward}</p>
                    </div>
                ))}
                {isYoutuber && <h2>Company sent to you:</h2>}
                {isYoutuber && 
                    applications.filter(a => a.type === 'COMPANY_SENT').map(a => (
                    <div key={a.ad.id}>
                        <p>Title - {a.ad.title}</p>
                        <p>Reward - {a.ad.reward}</p>
                    </div>
                ))}
            </div>
        )
    }
}

function mapState(state) {
    return {
        ads: state.ad.list,
        applications: state.ad.applications,
        companyDetails: state.company.details,
        isSubscriber: state.youtube.isSubscriber
    };
}

function mapDispatch(dispatch) {
    return {
        getCompanyDetails: (companyId) => dispatch(getCompanyDetailsAction(companyId)),
        getCompanyProfile: () => dispatch(getCompanyProfileAction()),
        getCompanyAds: () => dispatch(getCompanyAdsAction()),
        getCompanyAdsById: (companyId) => dispatch(getCompanyAdsByIdAction(companyId)),
        getApplicationsByCompany: (companyId) => dispatch(getApplicationsByCompanyAction(companyId)),
        checkSubscription: (companyId) => dispatch(checkSubscriptionAction(companyId)),
        subscribe: (companyId) => dispatch(subscribeAction(companyId))
    };
}

export default withRouter(connect(mapState, mapDispatch)(CompanyDetailsPage));