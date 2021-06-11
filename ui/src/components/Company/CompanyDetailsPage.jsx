import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { TextArea, Icon, Button } from 'semantic-ui-react';
import SliderBox from '../common/SliderBox';
import AdCard from './../Ad/AdCard';
import { getCompanyAdsAction, getCompanyAdsByIdAction } from '../../actions/adActions';
import { getApplicationsByCompanyAction } from '../../actions/applicationActions';
import { getCompanyDetailsAction, getCompanyProfileAction } from '../../actions/companyActions';
import { subscribeAction, checkSubscriptionAction } from '../../actions/subscriptionActions';
import { hasRole } from '../../utils/AuthUtil';
import { EMPLOYER, YOUTUBER } from '../../utils/Roles';

export default props => {
    const [loading, setLoading] = useState(true);

    const companyDetails = useSelector(state => state.company.details);
    const ads = useSelector(state => state.ad.list.items);
    const applications = useSelector(state => state.application.list);
    const isSubscriber = useSelector(state => state.subscription.isSubscriber);
    const dispatch = useDispatch();

    useEffect(() => {
        (async () => {
            const companyId = props.match.params.companyId;

            if (companyId) {
                await dispatch(getCompanyDetailsAction(companyId));
                await dispatch(getCompanyAdsByIdAction(companyId));
            } else {
                await dispatch(getCompanyProfileAction());
                await dispatch(getCompanyAdsAction());
            }

            if (hasRole(YOUTUBER)) {
                await dispatch(getApplicationsByCompanyAction(companyId))
                await dispatch(checkSubscriptionAction(companyId));
            }

            setLoading(false);
        })();
    }, []);

    if (loading) {
        return <div>{'Loading...'}</div>;
    }

    const availableAds = ads.filter(a => !a.isBlocked && new Date(a.validTo) - new Date() >= 0);
    const outdatedAds = ads.filter(a => !a.isBlocked && new Date(a.validTo) - new Date() < 0);
    const blockedAds = ads.filter(a => a.isBlocked);
    
    return (
        <div className="company-details">
            <div className="company-details-title">
                <h2>Профил на компанията</h2>
                <hr />
            </div>
            <div className="company-details-info">
                <div className="company-details-left-info">
                    <img src={companyDetails.logoUrl} alt="Company logo"/>
                    <h2>{companyDetails.userName}</h2>
                    <h3>{companyDetails.userEmail}</h3>
                    <div>Дата на създаване: {new Date(companyDetails.companyCreationDate).toLocaleDateString()}</div>
                    <div>Дата на регистрация: {new Date(companyDetails.userCreatedDate).toLocaleDateString()}</div>
                </div>
                <div className="company-details-right-info">
                    <div className="company-details-description">
                        <h3>Описание на дейността:</h3>
                        <TextArea
                            id="company-details-description-textarea"
                            value={companyDetails.description}
                            disabled={true} />
                    </div>
                    <div className="company-details-props">
                        <div className="company-details-prop">
                            <span><Icon name="phone" /> Телефон </span>
                            <span>{companyDetails.phone}</span>
                        </div>
                        <div className="company-details-prop">
                            <span><Icon name="money bill alternate outline" /> Приходи </span>
                            <span>{companyDetails.incomeLastYear} &euro;</span>
                        </div>
                        <div className="company-details-prop">
                            <span><Icon name="building outline" /> Град </span>
                            <span>{companyDetails.town}</span>
                        </div>
                        <div className="company-details-prop">
                            <span><Icon name="users" /> Брой служители </span>
                            <span>{companyDetails.workersCount}</span>
                        </div>
                    </div>
                    <div className="company-details-buttons">
                        {(hasRole(YOUTUBER) && !isSubscriber) &&
                            <Button inverted
                                color="orange"
                                size="large"
                                onClick={() => dispatch(subscribeAction(companyDetails.id))}>
                                Абонирай се
                            </Button>
                        }
                    </div>
                </div>
            </div>
            {availableAds.length > 0 && <div className="company-available-ads">
                <div className="company-details-title">
                    <h2>Текущи обяви - {availableAds.length}</h2>
                    <hr />
                </div>
                <div className="company-details-ads-container">
                    <SliderBox 
                        items={availableAds.map(a => <AdCard key={a.id} ad={a} isOwner={hasRole(EMPLOYER)} />)}
                    />
                </div>
            </div>}
            {outdatedAds.length > 0 && <div className="company-outdate-ads">
                <div className="company-details-title">
                    <h2>Изтекли обяви - {outdatedAds.length}</h2>
                    <hr />
                </div>
                <div className="company-details-ads-container">
                    <SliderBox 
                        items={outdatedAds.map(a => <AdCard key={a.id} isHidden={false} ad={a} />)}
                    />
                </div>
            </div>}
            {blockedAds.length > 0 && <div className="company-blocked-ads">
                <div className="company-details-title">
                    <h2>Блокирани обяви - {blockedAds.length}</h2>
                    <hr />
                </div>
                <div className="company-details-ads-container">
                    <SliderBox 
                        items={blockedAds.map(a => <AdCard key={a.id} isHidden={false} ad={a} />)}
                    />
                </div>
            </div>}
            {(hasRole(YOUTUBER) && applications.length > 0) && <div className="youtuber-applications-to-company">
                <div className="company-details-title">
                    <h2>Кандидатствания за партнюрствa - {applications.length}</h2>
                    <hr />
                </div>
                <div className="company-details-ads-container">
                    <SliderBox 
                        items={applications.map(a => 
                            <AdCard 
                                key={a.ad.id}
                                ad={a.ad}
                                isHidden={true}
                                validToText={`Дата на заявката - ${new Date(a.applicationDate).toLocaleDateString()}`}
                            />)}
                    />
                </div>
            </div>}
        </div>
    );
};

/*class CompanyDetailsPage extends Component {
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

            const userRoles = JSON.parse(getCookie("roles"));
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

        const userRoles = JSON.parse(getCookie("roles"));
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
                        <p><Link className="ad-deltail" to={`/ad/details/${a.id}`}>Details</Link></p>
                        {isEmployer && <p><Link className="ad-edit" to={`/ad/edit/${a.id}`}>Edit</Link></p>}
                        {isEmployer && <p>
                            <Dialog
                                checkForErrors={null}
                                onSubmitHandler={() => this.props.deleteAd(a.id)}
                                buttonAgree='Изтрий'
                                buttonDisagree='Отказване'
                                dialogContent='Наистина ли искате да изтриете рекламнaта обява ?'
                            />
                            <Link className="ad-delete" to={`/ad/delete/${a.id}`}>Delete</Link>
                        </p>}
                        {// TODO: check if owner is log in for edit ad }
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
        subscribe: (companyId) => dispatch(subscribeAction(companyId)),
        deleteAd: (adId) => dispatch(deleteAdAction(adId))
    };
}

export default withRouter(connect(mapState, mapDispatch)(CompanyDetailsPage));*/