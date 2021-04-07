import React, { Component } from 'react';
import { Redirect } from 'react-router-dom'
import { toast } from 'react-toastify';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { loadUserInfoAction } from '../../actions/youtubeActions';

class OAuth2RedirectHandler extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: true
        };
    }

    getUrlParameter(name) { //TODO: should i remove it??
        name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
        var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');

        var results = regex.exec(this.props.location.search);
        return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    };

    render() {
        const token = this.props.location.search.split("=")[1];
        //const error = this.getUrlParameter('error');

        if (this.state.loading && token) {
            
            localStorage.setItem("accessToken", token);

            this.props.loadUserInfo().then(() => {
                this.setState({ loading: false });
            });

            return "Loading...";
        }

        if(token) {
            toast.success("Login with youtube successful.");

            return <Redirect to={{
                pathname: "/youtube/profile"
            }}/>;
        } else {
            return <Redirect to={{
                pathname: "/"
            }}/>; 
        }
    }
}

function mapDispatch(dispatch) {
    return {
        loadUserInfo: () => dispatch(loadUserInfoAction())
    };
}

export default withRouter(connect(null, mapDispatch)(OAuth2RedirectHandler));