import React, { Component } from 'react';
import { Menu, Dropdown, Icon } from 'semantic-ui-react';
import { NavLink } from 'react-router-dom';
import { googleRequestUrl } from '../../services/requester';
import { getCookie } from '../../utils/CookiesUtil';

export default class Header extends Component {
    state = { activeItem: 'home' }

    handleItemClick = (e, { name }) => this.setState({ activeItem: name })

    render() {
        const { loggedIn, onLogout } = this.props;
        const userRoles = JSON.parse(getCookie("roles"));
        const isYoutuber = userRoles != null && userRoles.some(e => e == 'YOUTUBER');
        const isAdmin = userRoles != null && userRoles.some(e => e == 'ADMIN');
        const isEmployer = userRoles != null && userRoles.some(e => e == 'EMPLOYER');

        const { activeItem } = this.state;
        console.log(activeItem);

        return (
            <header>
                <Menu color='blue' inverted>
                    <NavLink to="/">
                        <h2 id="menu-logo">
                            Ads <Icon color='orange' name='handshake outline'/> Partners
                        </h2>
                    </NavLink>
                    {loggedIn && <h4 className="menu-welcome">
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
                        {!loggedIn && <Menu.Item
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
                        {!loggedIn && <Menu.Item
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
                        {loggedIn && <Menu.Item
                            name='logout'
                            active={activeItem === 'logout'}
                            onClick={onLogout}
                        >Изход</Menu.Item>}
                    </Menu.Menu>
                </Menu>
            </header>
        );
    }
}