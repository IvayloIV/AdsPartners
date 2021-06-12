import React, { Component } from 'react';
import { Redirect } from 'react-router-dom'
import { toast } from 'react-toastify';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { loadUserInfoAction } from '../../actions/youtubeActions';
import { setCookie } from '../../utils/CookiesUtil';

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
        const [name, token] = this.props.location.search.split("=");
        const hasError = name === '?error';

        if (this.state.loading && !hasError) {
            setCookie("accessToken", token, 1);

            this.props.loadUserInfo().then(() => {
                this.setState({ loading: false });
            });

            return "Loading...";
        }

        if(hasError) {
            toast.error("Неуспешно влизане.");
        } else {
            toast.success("Успешно влязохте като ютубър.");
        }

        return <Redirect to={{
            pathname: "/"
        }}/>;
    }
}

function mapDispatch(dispatch) {
    return {
        loadUserInfo: () => dispatch(loadUserInfoAction())
    };
}

export default withRouter(connect(null, mapDispatch)(OAuth2RedirectHandler));