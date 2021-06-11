import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { Button, Rating, Icon, TextArea } from 'semantic-ui-react';
import SliderBox from '../common/SliderBox';
import { getAdDetailsAction, voteForAdAction } from '../../actions/adActions';
import { getApplicationsByAdAction, applyForAdAction } from '../../actions/applicationActions';
import { getYoutuberProfileAction } from '../../actions/youtubeActions';
import { hasRole, hasAnyRole } from '../../utils/AuthUtil';
import { YOUTUBER, EMPLOYER, ADMIN } from '../../utils/Roles';

export default props => {
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(true);

    const ad = useSelector(state => state.ad.details);
    const applications = useSelector(state => state.application.list);
    const youtuber = useSelector(state => state.youtube.details);
    const dispatch = useDispatch();

    useEffect(() => {
        (async () => {
            const adId = props.match.params.adId;
            await dispatch(getAdDetailsAction(adId));

            if (hasRole(YOUTUBER)) {
                await dispatch(getYoutuberProfileAction());
            } else {
                await dispatch(getApplicationsByAdAction(adId));
            }
            
            setLoading(false);
        })();
    }, []);

    const onApplyForHandler = async () => {
        const adId = props.match.params.adId;
        await dispatch(applyForAdAction(adId, { description }));
        dispatch(getYoutuberProfileAction());
        dispatch(getAdDetailsAction(adId));
    };

    const voteForAdHandler = async (adId, rating) => { 
        await dispatch(voteForAdAction(adId, rating));
        dispatch(getAdDetailsAction(adId));
    };

    if (loading) {
        return <div>{'Loading...'}</div>;
    }

    const outOfDate = new Date(ad.validTo) - new Date() < 0;
    const isYoutuber = hasRole(YOUTUBER);
    const haveEnoughtVideos = isYoutuber && ad.minVideos <= youtuber.videoCount;
    const haveEnoughtSubs = isYoutuber && ad.minSubscribers <= youtuber.subscriberCount;
    const haveEnoughtViews = isYoutuber && ad.minViews <= youtuber.viewCount;
    const notApplied = isYoutuber && youtuber.adApplicationList.every(a => a.ad.id !== ad.id);

    return (
        <div className="ad-details">
            <h2>Детайли на рекламната обява</h2>
            <div className="ad-details-container">
                <div className="ad-details-left-container">
                    <div className="ad-details-img">
                        <img src={ad.pictureUrl} id={outOfDate || ad.isBlocked ? 'ad-details-out-of-date' : ''} alt="Ad picture"/>
                        {outOfDate && <span className="ad-details-out-of-date-text">Обявата е изтекла</span>}
                        {ad.isBlocked && <span className="ad-details-blocked-icon">
                            <Icon name="ban" color="red" id="ad-details-blocked-ban-icon" size="massive"/>
                        </span>}
                    </div>
                    <h2>{ad.title}</h2>
                    <div className="ad-details-rating">
                        <Rating 
                            maxRating={5} 
                            defaultRating={isYoutuber ? (ad.ratingResponse != null ? ad.ratingResponse.rating : 0) : Math.round(ad.averageRating)}
                            disabled={!isYoutuber || ad.ratingResponse != null || outOfDate || ad.isBlocked}
                            onRate={(e, v) => voteForAdHandler(ad.id, v.rating)}
                            icon='star'
                            size="huge"
                        /> <span className="ad-list-rating-text">({Number(ad.averageRating.toFixed(2))})</span>
                    </div>
                    <h3>Възнаграждение: {ad.reward} &euro;</h3>
                    <h3>Брой кандидати за обявата до сега: {ad.applicationCount}</h3>
                    <div className="ad-details-requirements">
                        <h4>Минимален брой:</h4>
                        <ul>
                            <li>видеа - {ad.minVideos || 0}
                                {!haveEnoughtVideos && isYoutuber ? <span className="ad-details-yotuber-diff">{` - още ${ad.minVideos - youtuber.videoCount} ви трябват`}</span> : ''}
                            </li>
                            <li>абонати - {ad.minSubscribers || 0}
                                {!haveEnoughtSubs && isYoutuber ? <span className="ad-details-yotuber-diff">{` - още ${ad.minSubscribers - youtuber.subscriberCount} ви трябват`}</span> : ''}
                            </li>
                            <li>показвания - {ad.minViews || 0}
                                {!haveEnoughtViews && isYoutuber ? <span className="ad-details-yotuber-diff">{` - още ${ad.minViews - youtuber.viewCount} ви трябват`}</span> : ''}
                            </li>
                        </ul>
                    </div>
                    <div className="ad-details-date">
                        <Icon name="clock outline" /> 
                        Дата на създаване: <span>{new Date(ad.creationDate).toLocaleDateString()}</span></div>
                    <div className="ad-details-date">
                        <Icon name="clock outline" /> 
                        Валидна до: <span>{new Date(ad.validTo).toLocaleDateString()}</span>
                    </div>
                    <div className="ad-details-description">
                        <h3>Описание:</h3>
                        <TextArea
                            id="ad-details-description-textarea"
                            value={ad.shortDescription}
                            disabled={true} />
                    </div>
                    {ad.characteristics.length > 0 && 
                    <div className="ad-details-characteristics">
                        <h3>Допълнителни характеристики:</h3>
                        <ul>
                            {ad.characteristics.map(c => <li key={c.id}>{c.name + ' - ' + c.value}</li>)}
                        </ul>
                    </div>}
                </div>
                <div className="ad-details-right-container">
                    <div className="ad-details-company-info">
                        <h2>Създател на рекламната обява:</h2>
                        <img src={ad.company.logoUrl} alt="Company logo" />
                        <h3>{ad.company.userName}</h3>
                        <h3>{ad.company.userEmail}</h3>
                        <div>
                            <Button color='blue'
                                size="large"
                                as={NavLink}
                                to={hasRole(EMPLOYER) ? '/company/profile' : `/company/details/${ad.company.id}`}>
                                    Детайли
                            </Button>
                        </div>
                    </div>
                    {notApplied && <div className="ad-details-apply-for">
                        <h2>Изпрати предложение за партньорство:</h2>
                        {ad.isBlocked && <p className="ad-details-apply-for-validation">Рекламната обява е блокирана.</p>}
                        {outOfDate && <p className="ad-details-apply-for-validation">Рекламната обява е изтекла.</p>}
                        {(!haveEnoughtVideos || !haveEnoughtSubs || !haveEnoughtViews) && 
                            <p className="ad-details-apply-for-validation">Не отговаряте на изискванията на обявата (в червено).</p>}
                        {!ad.isBlocked &&  !outOfDate &&  haveEnoughtVideos &&  haveEnoughtSubs &&  haveEnoughtViews && notApplied &&
                        <div>
                            <TextArea
                                id="ad-details-apply-for-textarea"
                                onChange={e => setDescription(e.target.value)}
                                placeholder="Съобщение до компанията" />
                            <Button color='blue'
                                size="large"
                                onClick={onApplyForHandler}>
                                <Icon name="mail outline" /> Изпрати
                            </Button>
                        </div>}
                    </div>}
                </div>
            </div>
            {(hasAnyRole([EMPLOYER, ADMIN]) && applications.length > 0) && <div className="youtuber-applications-to-ad">
                <div className="ad-details-applicatoins-title">
                    <h2>Кандидатствания за партнюрствa</h2>
                </div>
                <div className="ad-details-applicatoins-container">
                    <SliderBox
                        moveGap={2}
                        items={applications.map(a => 
                            <div className="ad-details-applicatoins-wrapper" key={a.id}>
                                <img src={a.youtuber.profilePicture} alt="Youtuber image" />
                                <div className="ad-details-application-info">
                                    <h3>{a.youtuber.name}</h3>
                                    <div><Icon name="clock outline" /> Дата за заявяване - {new Date(a.applicationDate).toLocaleDateString()}</div>
                                    <div className="ad-details-application-button">
                                        <Button color='youtube'
                                            as={NavLink}
                                            to={`/youtuber/details/${a.youtuber.id}`} >
                                            <Icon name="youtube" /> Детайли
                                        </Button>
                                    </div>
                                </div>
                            </div>)}
                    />
                </div>
            </div>}
        </div>
    );
};

/*class AdDetails extends Component {
    constructor(props) {
        super(props);

        this.state = {
            description: '',
            loading: true
        };

        this.onChangeHandler = this.onChangeHandler.bind(this);
        this.onSubmitHandler = this.onSubmitHandler.bind(this);
    }

    onChangeHandler(e) {
        this.setState({ [e.target.name]: e.target.value });
    }

    onSubmitHandler(e) {
        e.preventDefault();
        const { description } = this.state;
        const adId = this.props.match.params.adId;

        this.props.applyForAd(adId, { description });
    }

    async componentDidMount() {
        try {
            const adId = this.props.match.params.adId;
            await this.props.loadAdDetails(adId);
            await this.props.getApplications(adId);
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
        
        const { id, title, shortDescription, reward, creationDate, validTo, minVideos, 
            minSubscribers, minViews, isBlocked, pictureUrl, characteristics, averageRating, company } = this.props.ad;

        return (
            <div className="ad-details">
                <img src={pictureUrl} alt="ad-image" width="250px" height="200px" />
                <h2>{title}</h2>
                <p>{shortDescription}</p>
                <p>Reward - {reward}</p>
                <p>Creation date - {creationDate}</p>
                <p>Valid to - {validTo}</p>
                <p>Min videos - {minVideos}</p>
                <p>Min subscribers - {minSubscribers}</p>
                <p>Min views - {minViews}</p>
                <p>Is blocked - {isBlocked == 1 ? 'Yes' : 'No'}</p>
                <Rating
                    // value={0} TODO...
                    // precision={0.5} TODO...
                    name={`rating-${id}`}
                    emptyIcon={<StarBorderIcon fontSize="inherit"/>}
                    onChange={(e, r) => this.props.voteForAd(id, r)} 
                />
                <p>Average rating - {averageRating}</p>
                <h3>Characteristics: </h3>
                {characteristics.map(c => (
                    <div key={c.id}>
                        <p>Name - {c.name}</p>
                        <p>Email - {c.value}</p>
                    </div>
                ))}
                <div>
                    <h3>Company:</h3>
                    <img src={company.logoUrl} alt="companyLogo" width="150px" height="100px" />
                    <p>Name - {company.userName}</p>
                    <p>Email - {company.userEmail}</p>
                </div>
                {hasRole(YOUTUBER) && <form onSubmit={this.onSubmitHandler}>
                    <TextField
                        id="outlined-multiline-static"
                        label="Description"
                        multiline
                        rows={4}
                        name="description"
                        onChange={this.onChangeHandler}
                        // defaultValue="Default Value"
                        variant="outlined"
                    />
                    <Button 
                        type="submit"
                        variant="contained" 
                        color="primary">
                        Send
                    </Button>
                </form>}
                {hasRole(EMPLOYER) && <h3>Applications</h3>}
                {hasRole(EMPLOYER) && this.props.applications.map((a, i) => (
                    <div key={i}>
                        <p>{a.type === "YOUTUBER_SENT" ? 'Youtuber -> Company' : 'Company -> Youtuber'}</p>
                        <img src={a.youtuber.profilePicture} alt="youtuber-image" width="250px" height="200px" />
                        <p>Name - {a.youtuber.name}</p>
                        <p>Applied Date - {a.applicationDate}</p>
                    </div>
                ))}
            </div>
        )
    }
}

function mapState(state) {
    return {
        ad: state.ad.details,
        applications: state.ad.applications
    };
}

function mapDispatch(dispatch) {
    return {
        loadAdDetails: (adId) => dispatch(getAdDetailsAction(adId)),
        voteForAd: (adId, rating) => dispatch(voteForAdAction(adId, rating)),
        applyForAd: (adId, params) => dispatch(applyForAdAction(adId, params)),
        getApplications: (adId) => dispatch(getApplicationsAction(adId))
    };
}

export default withRouter(connect(mapState, mapDispatch)(AdDetails));*/