import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from 'react-router-dom';
import { Button, Icon, Loader } from 'semantic-ui-react';
import { googleRequestUrl } from '../../services/requester';
import SliderBox from '../common/SliderBox';
import CompanyBox from './CompanyBox';
import YoutuberBox from './YoutuberBox';
import { getCompaniesByRatingAction } from '../../actions/companyActions';
import { getYoutubersBySubsAction } from '../../actions/youtubeActions';
import { isAuthed } from '../../utils/AuthUtil';

export default () => {
    const [loading, setLoading] = useState(true);
    const companies = useSelector(state => state.company.list);
    const youtubers = useSelector(state => state.youtube.list);
    const dispatch = useDispatch();

    useEffect(() => {
        (async () => {
           await Promise.all([dispatch(getCompaniesByRatingAction(10)), 
                dispatch(getYoutubersBySubsAction(10))]);
            setLoading(false);
        })();
    }, []);

    if (loading) {
        return <Loader active id="loader" size="large" inline="centered" content="Зареждане..."/>;
    }

    return (
        <div className="homepage">
            <section className="site-logo">
                <h1>Рекламно партньорство</h1>
                <hr />
                {!isAuthed() && <div className="login-buttons">
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
                <p>Сайтът е създаден през 2021 г, като разработка на дипломна работа в ТУ- Габрово.
                    Нашата цел е да свърже по най-лесния и успешен начин инициативни компании и активни ютубъри,
                    осигурявайки сигурност, лоялност и печалба от двете страни на партньорството.
                </p>
            </section>
            <section className="company-home-container">
                <div className="company-title">
                    <h2><span>Топ 10</span> Компании с най-добър рейтинг</h2>
                    <hr />
                </div>
                <SliderBox items={companies.map(c => <CompanyBox company={c} />)} />
            </section>
            <section className="about-you">
                <h2>Какво ще направим за Вас</h2>
                <hr />
                <p>Създаваме най-добрите маркетинг партньори в три лесни стъпки</p>
                <div>
                    <span>правилен избор на партньор</span>
                    <Icon name='long arrow alternate right' size="huge" color="blue" />
                    <span>осъществен контакт</span>
                    <Icon name='long arrow alternate right' size="huge" color="blue" />
                    <span>успешен бизнес</span>
                </div>
            </section>
            <section className="youtber-home-container">
                <div className="youtuber-title">
                    <h2><span>Топ 10</span> Ютубъри с най-много абонати</h2>
                    <hr />
                </div>
                <SliderBox items={youtubers.map(y => <YoutuberBox youtuber={y} />)} />
            </section>
        </div>
    );
};
