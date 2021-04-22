import React, { Component } from 'react';
import traverson from 'traverson';
import JsonHalAdapter from 'traverson-hal';
import SliderBox from '../common/SliderBox';
import { connect } from 'react-redux';
import { withRouter, NavLink } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getCompaniesByRatingAction } from '../../actions/companyActions';
import { getYoutubersBySubsAction } from '../../actions/youtubeActions';

// 		traverson.registerMediaType(JsonHalAdapter.mediaType, JsonHalAdapter);
		
//         /*traverson.from('http://localhost:8080/api')
//             .follow('ingredients')
// 			.post({ "id": "12", "name": "Ing12", "type": "MEAT"}, (err, res) => {
// 				console.log(err);
// 				console.log(res);
// 			});*/

class HomePage extends Component {
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

        let companiesBoxes = companies.map(c => (
            <div className="company-home" key={c.id}>
                <img src={c.logoUrl} alt="company-logo" width="50px" height="30px"/>
                <h3>{c.userName} ({c.averageRating})</h3>
                <h3>Town - {c.town}</h3>
            </div>
        ));

        let youtubersBoxes = youtubers.map(y => (
            <div className="youtuber-home" key={y.channelId}>
                <img src={y.profilePicture} alt="youtuber-picture" width="50px" height="30px"/>
                <h3>{y.name} ({y.subscriberCount} subs)</h3>
                <a href={'https://www.youtube.com/channel/' + y.channelId} target="_blank">View Channel</a>
            </div>
        ));

        const googleUrl = "http://localhost:8080/oauth2/authorization/google?redirect_uri=http://localhost:3000/oauth2/redirect"; //TODO remove it from here
        const loggedIn = localStorage.getItem("accessToken") != null;

        return (
            <div className="homepage">
                <div>
                {!loggedIn && <NavLink to="/company/login" activeClassName="active">Login Company</NavLink>}
                {!loggedIn && <a href={googleUrl}>Login Youtube</a>}
                </div>
                <div>
                    <h2>Site description</h2>
                    <p>To increase your salary!</p>
                </div>
                <div>
                    <h2>Companies</h2>
                    <SliderBox boxes={companiesBoxes}></SliderBox>
                </div>
                <div>
                    <h2>Youtubers</h2>
                    <SliderBox boxes={youtubersBoxes}></SliderBox>
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

export default withRouter(connect(mapState, mapDispatch)(HomePage));