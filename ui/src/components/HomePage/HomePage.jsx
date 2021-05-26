import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from 'react-router-dom';
import { Button, Icon } from 'semantic-ui-react';
import { googleRequestUrl } from '../../services/requester';
import SliderBox from '../common/SliderBox';
import CompanyBox from './CompanyBox';
import YoutuberBox from './YoutuberBox';
import { getCompaniesByRatingAction } from '../../actions/companyActions';
import { getYoutubersBySubsAction } from '../../actions/youtubeActions';

export default ({ isAuthed }) => {
    const [loading, setLoading] = useState(true);
    const companies = useSelector(state => state.company.list);
    const youtubers = useSelector(state => state.youtube.list);
    const dispatch = useDispatch();

    useEffect(() => {
        (async () => {
            await dispatch(getCompaniesByRatingAction(10));
            await dispatch(getYoutubersBySubsAction(10));
            setLoading(false);
        })();
    }, []);

    if (loading) {
        return <div>{'Loading...'}</div>;
    }

    return (
        <div className="homepage">
            <section className="site-logo">
                <h1>Рекламно партньорство</h1>
                <hr />
                {!isAuthed && <div className="login-buttons">
                    <Button color='orange' className="large" as={NavLink} to="/company/login">
                        <Icon name='briefcase' />  Вход за компания
                    </Button>
                    <Button color='youtube' className="large" as="a" href={googleRequestUrl}>
                        <Icon name='youtube' /> Вход за ютубър
                    </Button>
                </div>}
            </section>
            <section className="about-us">
                <h2>За нас</h2>
                <hr />
                <p>Сайтът е създаден през 2021, като разработка на дипломна работа в ТУ-Габрово.
                    Нащата цел е да свърже по най-лесния и успешен начин инициативни компании и активни ютубъри.
                    Осигурявайки сигурност, лоялност и печалба от двете страни на партньорство.
                </p>
            </section>
            <section className="company-home-container">
                <div className="company-title">
                    <h2>Топ 10 Компании с най-добър рейтинг</h2>
                    <hr />
                </div>
                <SliderBox items={companies.map(c => <CompanyBox company={c} />)} />
            </section>
            <section className="about-you">
                <h2>Както ще направим за Вас</h2>
                <hr />
                <p>Създаваме най-добрите маркетинг партньори в 3 лесни стъпки</p>
                <div>
                    <span>правилен избор на партньор</span>
                    <Icon name='long arrow alternate right' size="huge" color="blue" />
                    <span>осъществен контант</span>
                    <Icon name='long arrow alternate right' size="huge" color="blue" />
                    <span>успешен бизнес</span>
                </div>
            </section>
            <section className="youtber-home-container">
                <div className="youtuber-title">
                    <h2>Топ 10 Ютубъри с най-много абонати</h2>
                    <hr />
                </div>
                <SliderBox items={youtubers.map(y => <YoutuberBox youtuber={y} />)} />
            </section>
        </div>
    );
};

/*class HomePage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: true
        };
    }

    async componentDidMount() {
        try {
            await this.props.getCompaniesByRating(10);
            await this.props.getYoutubersBySubs(10);
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
        
        const { companies, youtubers } = this.props;
        const googleUrl = "http://localhost:8080/oauth2/authorization/google?redirect_uri=http://localhost:3000/oauth2/redirect"; //TODO remove it from here

        const loggedIn = localStorage.getItem("accessToken") != null;

        return (
            <div className="homepage">
                <section className="site-logo">
                    <h1>Рекламно партньорство</h1>
                    <hr />
                    {!loggedIn && <div class="login-buttons">
                        <Button color='orange' className="large" as={NavLink} to="/company/login">
                            <Icon name='briefcase' />  Вход за компания
                        </Button>
                        <Button color='youtube' className="large" as="a" href={googleUrl}>
                            <Icon name='youtube' /> Вход за ютубър
                        </Button>
                    </div>}
                </section>
                <div class="site-description">
                    <h2>За нас</h2>
                    <hr />
                    <p>Сайтът е създаден през 2021, като разработка на дипломна работа в ТУ-Габрово.
                        Нащата цел е да свърже по най-лесния и успешен начин инициативни компании и активни ютубъри.
                        Осигурявайки сигурност, лоялност и печалба от двете страни на партньорство.
                    </p>
                </div>
                <div className="company-home-container">
                    <div className="company-title">
                        <h2>Топ 10 Компании с най-добър рейтинг</h2>
                        <hr />
                    </div>
                    <SliderBox items={companies.map(c => <CompanyBox company={c} />)} />
                </div>
                <div className="youtber-home-container">
                    <div className="youtuber-title">
                        <h2>Топ 10 Ютубъри с най-много абонати търсещи рекламно партньорство</h2>
                        <hr />
                    </div>
                    <SliderBox items={youtubers.map(y => <YoutuberBox youtuber={y} />)} />
                </div>
            </div>
        )
    }
}

function mapState(state) {
    return {
        companies: state.company.list,
        youtubers: state.youtube.list
    };
}

function mapDispatch(dispatch) {
    return {
        getCompaniesByRating: (pageSize) => dispatch(getCompaniesByRatingAction(pageSize)),
        getYoutubersBySubs: (pageSize) => dispatch(getYoutubersBySubsAction(pageSize))
    };
}

export default withRouter(connect(mapState, mapDispatch)(HomePage));*/