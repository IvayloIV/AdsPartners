import React from 'react';
import { useDispatch } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Dropdown } from 'semantic-ui-react';
import { googleRequestUrl } from '../../services/requester';
import { logoutAction } from '../../actions/commonActions';
import { getCookie } from '../../utils/CookiesUtil';
import { hasRole, isAuthed } from '../../utils/AuthUtil';
import { YOUTUBER, ADMIN, EMPLOYER } from '../../utils/Roles';

export default props => {
    const dispatch = useDispatch();

    const isYoutuber = hasRole(YOUTUBER);
    const isAdmin = hasRole(ADMIN);
    const isEmployer = hasRole(EMPLOYER);

    const onLogout = async () => {
        await dispatch(logoutAction());
		toast.success('Успешно излязохте от профила си.');
        props.history.push('/');
    };

    return (
        <header>
            <nav className="navigation">
                <div className="nav-text">
                    <NavLink to="/">
                        <h1>
                            <span>Ads</span>
                            <img src="/images/handshake.png" alt="Handshake logo"/>
                            <span>Partners</span>
                        </h1>
                    </NavLink>
                    {isAuthed() && <h2>Добре дошли, {getCookie("username")}!</h2>}
                </div>
                <div className="nav-items">
                    <ul>
                        <li><NavLink to="/" activeClassName="active-tab" exact={true}>Начало</NavLink></li>
                        {!isAuthed() && 
                            <Dropdown text='Вход' pointing className='link item' id="menu-dropdown">
                                <Dropdown.Menu>
                                    <Dropdown.Item
                                        as={NavLink}
                                        to="/company/login"
                                    >За компании</Dropdown.Item>
                                    <Dropdown.Item
                                        as='a'
                                        href={googleRequestUrl}
                                    >За ютубъри</Dropdown.Item>
                                    <Dropdown.Item
                                        as={NavLink}
                                        to="/admin/login"
                                    >За администратори</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>}
                        {!isAuthed() && <li><NavLink to="/company/register" activeClassName="active-tab">Регистрирай компания</NavLink></li>}
                        {isEmployer && <li><NavLink to="/ad/create" activeClassName="active-tab">Създай реклама</NavLink></li>}
                        {isEmployer && <li><NavLink to="/company/subscribers" activeClassName="active-tab">Абонати</NavLink></li>}
                        {isEmployer && <li><NavLink to="/company/profile" activeClassName="active-tab">Профил</NavLink></li>}
                        {isAdmin && <li><NavLink to="/company/requests" activeClassName="active-tab">Заявки на компаниите</NavLink></li>}
                        {isAdmin && <li><NavLink to="/company/list" activeClassName="active-tab">Управление на обявите</NavLink></li>}
                        {isYoutuber && <li><NavLink to="/ad/list" activeClassName="active-tab">Списък на обявите</NavLink></li>}
                        {isYoutuber && <li><NavLink to="/youtuber/profile" activeClassName="active-tab">Профил</NavLink></li>}
                        {isAuthed() && <li><span onClick={onLogout}>Изход</span></li>}
                    </ul>
                </div>
            </nav>
        </header>
    );
};
