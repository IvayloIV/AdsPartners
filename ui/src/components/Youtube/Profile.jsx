import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { refreshUserDataAction } from '../../actions/youtubeActions';

class Profile extends Component {

    render() {
        return (
            <div className="container">
                <h1>Profile Page</h1>
                <button onClick={this.props.refreshUserData}>Update info</button>
            </div>
        );
    }
}

function mapDispatch(dispatch) {
    return {
        refreshUserData: () => dispatch(refreshUserDataAction())
    };
}

export default withRouter(connect(null, mapDispatch)(Profile));