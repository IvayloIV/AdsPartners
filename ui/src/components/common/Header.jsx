import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

export default class Header extends Component {
    render() {
        const { loggedIn, onLogout } = this.props;
        const googleUrl = "http://localhost:8080/oauth2/authorization/google?redirect_uri=http://localhost:3000/oauth2/redirect";
        const userRoles = JSON.parse(localStorage.getItem("roles"));
        const isYoutuber = userRoles != null && userRoles.some(e => e == 'YOUTUBER');
        const isAdmin = userRoles != null && userRoles.some(e => e == 'ADMIN');
        const isEmployer = userRoles != null && userRoles.some(e => e == 'EMPLOYER');

        return (
            <header>
                <NavLink exact to="/" activeClassName="active">Home</NavLink>
                {loggedIn && <span>Hi, {localStorage.getItem("username")}</span>}
                {!loggedIn && <NavLink to="/company/login" activeClassName="active">Login Company</NavLink>}
                {!loggedIn && <NavLink to="/company/register" activeClassName="active">Register Company</NavLink>}
                {!loggedIn && <NavLink to="/admin/login" activeClassName="active">Login Admin</NavLink>}
                {isYoutuber && <NavLink to="/youtube/profile" activeClassName="active">Profile</NavLink>}
                {(isAdmin || isEmployer) && <NavLink to="/company/page" activeClassName="active">Company Page</NavLink>}
                {(isAdmin || isEmployer) && <NavLink to="/ad/create" activeClassName="active">Create Ad</NavLink>}
                {!loggedIn && <a href={googleUrl}>Login Youtube</a>}
                {loggedIn && <a href="javascript:void(0)" onClick={onLogout}>Logout</a>}
            </header>
        );
    }
}