import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from 'react-router-dom';
import { Table, TextArea, Icon, Button } from 'semantic-ui-react';
import { getYoutuberProfileAction, refreshYoutuberDataAction, getYoutuberDetailsAction } from '../../actions/youtubeActions';
import { getYoutuberApplicationAction } from '../../actions/adActions';
import { hasRole } from '../../utils/AuthUtil';
import { YOUTUBER } from '../../utils/Roles';

export default props => {
    const [loading, setLoading] = useState(true);

    const youtuberDetails = useSelector(state => state.youtube.details);
    const applications = useSelector(state => state.ad.applications);
    const dispatch = useDispatch();

    useEffect(() => {
        (async () => {
            if (hasRole(YOUTUBER)) {
                await dispatch(getYoutuberProfileAction());
            } else {
                const youtuberId = props.match.params.youtuberId;
                await dispatch(getYoutuberDetailsAction(youtuberId));
                await dispatch(getYoutuberApplicationAction(youtuberId));
            }

            setLoading(false);
        })();
    }, []);

    const updateYoutuberData = async () => {
        await dispatch(refreshYoutuberDataAction());
        await dispatch(getYoutuberProfileAction());
    };

    if (loading) {
        return <div>{'Loading...'}</div>;
    }

    let isYoutuber = hasRole(YOUTUBER);

    return (
        <div className="youtuber-details">
            <div className="youtuber-details-info-container">
                <div className="youtuber-details-img-container">
                    <img src={youtuberDetails.profilePicture} alt="Youtuber picture" />
                </div>
                <h2>{youtuberDetails.name}</h2>
                <h3>{youtuberDetails.email}</h3>
                <div className="youtuber-details-description">
                    <h4>Описание:</h4>
                    <TextArea
                        id="youtuber-details-description-textarea"
                        value={youtuberDetails.description}
                        disabled={true} />
                </div>
                <div className="youtuber-details-info">
                    <p>Абонати - {youtuberDetails.subscriberCount}</p>
                    <p>Видеа - {youtuberDetails.videoCount}</p>
                    <p>Показвания - {youtuberDetails.viewCount}</p>
                    <p>Член от {new Date(youtuberDetails.publishedAt).toLocaleDateString()}</p>
                    <p>Обновен в {new Date(youtuberDetails.updateDate).toLocaleString()}</p>
                </div>
                <div className="youtuber-details-buttons">
                    {isYoutuber && <Button color='orange'
                        className="medium"
                        id="youtuber-details-refresh"
                        onClick={updateYoutuberData}>
                            <Icon name="refresh"/> Обнови
                    </Button>}
                    <Button color='youtube'
                        className="medium"
                        id="youtuber-details-show-channel"
                        as="a"
                        href={'https://www.youtube.com/channel/' + youtuberDetails.channelId} target="_blank">
                            <Icon name='youtube' /> Виж канала
                    </Button>
                </div>
            </div>
            <div className="youtuber-details-applications">
                <h2>{`История на предложенията за партнюрства${!isYoutuber ? ' към Вас' : ''}`}</h2>
                <Table color="orange">
                    <Table.Header>
                        <Table.Row textAlign="center">
                            <Table.HeaderCell>Снимка на обявата</Table.HeaderCell>
                            <Table.HeaderCell>Заглавие на обявата</Table.HeaderCell>
                            <Table.HeaderCell>Дата на кандидатстване</Table.HeaderCell>
                            <Table.HeaderCell>Описание</Table.HeaderCell>
                            <Table.HeaderCell>Възнаграждение</Table.HeaderCell>
                            <Table.HeaderCell>Детайли на обявата</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {(isYoutuber ? youtuberDetails.adApplicationList : applications).map(a => (
                            <Table.Row key={a.ad.id} textAlign="left">
                                <Table.Cell textAlign="center">
                                    <span className="youtuber-details-application-img">
                                        <img src={a.ad.pictureUrl} alt="Ad picture" />
                                    </span>
                                </Table.Cell>
                                <Table.Cell>{a.ad.title}</Table.Cell>
                                <Table.Cell>{new Date(a.applicationDate).toLocaleDateString()}</Table.Cell>
                                <Table.Cell>{a.description}</Table.Cell>
                                <Table.Cell textAlign="right">{a.ad.reward} &euro;</Table.Cell>
                                <Table.Cell textAlign="center">
                                    <Button color="orange"
                                        className="medium"
                                        as={NavLink}
                                        to={`/ad/details/${a.ad.id}`}>
                                            Детайли
                                    </Button>
                                </Table.Cell>
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table>
            </div>
        </div>
    );
};

/*class YoutuberDetails extends Component {
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

export default withRouter(connect(mapState, mapDispatch)(YoutuberDetails));*/