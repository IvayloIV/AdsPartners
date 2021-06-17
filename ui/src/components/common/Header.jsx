import React, { Component } from 'react';
import { Menu, Dropdown, Icon } from 'semantic-ui-react';
import { NavLink } from 'react-router-dom';
import handshake from '../../images/handshake.png';
import { googleRequestUrl } from '../../services/requester';
import { getCookie } from '../../utils/CookiesUtil';
import { hasRole, isAuthed } from '../../utils/AuthUtil';
import { YOUTUBER, ADMIN, EMPLOYER } from '../../utils/Roles';

export default class Header extends Component {
    state = { activeItem: 'home' }

    handleItemClick = (e, { name }) => this.setState({ activeItem: name })

    render() {
        const { onLogout } = this.props;
        const isYoutuber = hasRole(YOUTUBER);
        const isAdmin = hasRole(ADMIN);
        const isEmployer = hasRole(EMPLOYER);

        const { activeItem } = this.state;

        return (
            <header>
                <nav className="navigation">
                    <div className="nav-text">
                        <NavLink to="/">
                            <h1>
                                <span>Ads</span>
                                <img src={handshake} alt="Handshake logo"/>
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
                {/* <Menu color='blue' inverted>
                    <NavLink to="/">
                        <h2 id="menu-logo">
                            Ads <Icon color='orange' name='handshake outline'/> Partners
                        </h2>
                    </NavLink>
                    {isAuthed() && <h4 className="menu-welcome">
                        Добре дошли, {getCookie("username")}
                    </h4>}
                    <Menu.Menu position='right'>
                        <Menu.Item
                            name='home'
                            active={activeItem === 'home'}
                            onClick={this.handleItemClick}
                            as={NavLink}
                            to="/home"
                        >Начало</Menu.Item>
                        {!isAuthed() && <Menu.Item
                            active={activeItem === 'login'}>
                            <Dropdown text='Вход' pointing className='link item' style={{padding: 0}}>
                                <Dropdown.Menu>
                                    <Dropdown.Item
                                        name='login'
                                        onClick={this.handleItemClick}
                                        as={NavLink}
                                        to="/company/login"
                                    >За компании</Dropdown.Item>
                                    <Dropdown.Item
                                        name='login'
                                        onClick={this.handleItemClick}
                                        as='a'
                                        href={googleRequestUrl}
                                    >За ютубъри</Dropdown.Item>
                                    <Dropdown.Item
                                        name='login'
                                        onClick={this.handleItemClick}
                                        as={NavLink}
                                        to="/admin/login"
                                    >За администратори</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </Menu.Item>}
                        {!isAuthed() && <Menu.Item
                            name='registerCompany'
                            active={activeItem === 'registerCompany'}
                            onClick={this.handleItemClick}
                            as={NavLink}
                            to="/company/register"
                        >Регистрирай компания</Menu.Item>}
                        {isEmployer && <Menu.Item
                            name='createAd'
                            active={activeItem === 'createAd'}
                            onClick={this.handleItemClick}
                            as={NavLink}
                            to="/ad/create"
                        >Създай реклама</Menu.Item>}
                        {isEmployer && <Menu.Item
                            name='youtubers'
                            active={activeItem === 'youtubers'}
                            onClick={this.handleItemClick}
                            as={NavLink}
                            to="/youtuber/list"
                        >Ютубъри</Menu.Item>}
                        {isEmployer && <Menu.Item
                            name='subscribers'
                            active={activeItem === 'subscribers'}
                            onClick={this.handleItemClick}
                            as={NavLink}
                            to="/company/subscribers"
                        >Абонати</Menu.Item>}
                        {isEmployer && <Menu.Item
                            name='companyProfile'
                            active={activeItem === 'companyProfile'}
                            onClick={this.handleItemClick}
                            as={NavLink}
                            to="/company/profile"
                        >Профил</Menu.Item>}
                        {isAdmin && <Menu.Item
                            name='companyRequests'
                            active={activeItem === 'companyRequests'}
                            onClick={this.handleItemClick}
                            as={NavLink}
                            to="/company/requests"
                        >Заявки на компаниите</Menu.Item>}
                        {isAdmin && <Menu.Item
                            name='companyBlock'
                            active={activeItem === 'companyBlock'}
                            onClick={this.handleItemClick}
                            as={NavLink}
                            to="/company/block"
                        >Управление на обявите</Menu.Item>}
                        {isYoutuber && <Menu.Item
                            name='adsList'
                            active={activeItem === 'adsList'}
                            onClick={this.handleItemClick}
                            as={NavLink}
                            to="/ad/list"
                        >Списък на обявите</Menu.Item>}
                        {isYoutuber && <Menu.Item
                            name='youtuberProfile'
                            active={activeItem === 'youtuberProfile'}
                            onClick={this.handleItemClick}
                            as={NavLink}
                            to="/youtuber/profile"
                        >Профил</Menu.Item>}
                        {isAuthed() && <Menu.Item
                            name='logout'
                            active={activeItem === 'logout'}
                            onClick={onLogout}
                        >Изход</Menu.Item>}
                    </Menu.Menu>
                </Menu> */}
            </header>
        );
    }
}