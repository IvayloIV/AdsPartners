import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { toast } from 'react-toastify';
import Slider from '@material-ui/core/Slider';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Pagination from '@material-ui/lab/Pagination';
import Rating from '@material-ui/lab/Rating';
import Button from '@material-ui/core/Button';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import { makeStyles } from '@material-ui/core/styles';
import { getAdDetailsAction, applyForAdAction, voteForAdAction, getApplicationsAction } from '../../actions/adActions';
import { getAllCompaniesAction } from '../../actions/companyActions';

class AdDetails extends Component {
    constructor(props) {
        super(props);

        this.state = {
            description: '',
            loading: true
        };

        this.onChangeHandler = this.onChangeHandler.bind(this);
        this.onSubmitHandler = this.onSubmitHandler.bind(this);
    }

    onChangeHandler(e) {
        this.setState({ [e.target.name]: e.target.value });
    }

    onSubmitHandler(e) {
        e.preventDefault();
        const { description } = this.state;
        const adId = this.props.match.params.adId;

        this.props.applyForAd(adId, { description });
    }

    async componentDidMount() {
        try {
            const adId = this.props.match.params.adId;
            await this.props.loadAdDetails(adId);
            await this.props.getApplications(adId);
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
        
        const { id, title, shortDescription, reward, creationDate, validTo, minVideos, 
            minSubscribers, minViews, isBlocked, pictureUrl, characteristics, averageRating, company } = this.props.ad;

        const roles = JSON.parse(localStorage.getItem('roles'));
        const isYoutuber = roles.includes('YOUTUBER');
        const isCompany = roles.includes('EMPLOYER');

        return (
            <div className="ad-details">
                <img src={pictureUrl} alt="ad-image" width="250px" height="200px" />
                <h2>{title}</h2>
                <p>{shortDescription}</p>
                <p>Reward - {reward}</p>
                <p>Creation date - {creationDate}</p>
                <p>Valid to - {validTo}</p>
                <p>Min videos - {minVideos}</p>
                <p>Min subscribers - {minSubscribers}</p>
                <p>Min views - {minViews}</p>
                <p>Is blocked - {isBlocked == 1 ? 'Yes' : 'No'}</p>
                <Rating
                    // value={0} TODO...
                    // precision={0.5} TODO...
                    name={`rating-${id}`}
                    emptyIcon={<StarBorderIcon fontSize="inherit"/>}
                    onChange={(e, r) => this.props.voteForAd(id, r)} 
                />
                <p>Average rating - {averageRating}</p>
                <h3>Characteristics: </h3>
                {characteristics.map(c => (
                    <div key={c.id}>
                        <p>Name - {c.name}</p>
                        <p>Email - {c.value}</p>
                    </div>
                ))}
                <div>
                    <h3>Company:</h3>
                    <img src={company.logoUrl} alt="companyLogo" width="150px" height="100px" />
                    <p>Name - {company.userName}</p>
                    <p>Email - {company.userEmail}</p>
                </div>
                {isYoutuber && <form onSubmit={this.onSubmitHandler}>
                    <TextField
                        id="outlined-multiline-static"
                        label="Description"
                        multiline
                        rows={4}
                        name="description"
                        onChange={this.onChangeHandler}
                        // defaultValue="Default Value"
                        variant="outlined"
                    />
                    <Button 
                        type="submit"
                        variant="contained" 
                        color="primary">
                        Send
                    </Button>
                </form>}
                {isCompany && <h3>Applications</h3>}
                {isCompany && this.props.applications.map((a, i) => (
                    <div key={i}>
                        <p>{a.type === "YOUTUBER_SENT" ? 'Youtuber -> Company' : 'Company -> Youtuber'}</p>
                        <img src={a.youtuber.profilePicture} alt="youtuber-image" width="250px" height="200px" />
                        <p>Name - {a.youtuber.name}</p>
                        <p>Applied Date - {a.applicationDate}</p>
                    </div>
                ))}
            </div>
        )
    }
}

function mapState(state) {
    return {
        ad: state.ad.details,
        applications: state.ad.applications
    };
}

function mapDispatch(dispatch) {
    return {
        loadAdDetails: (adId) => dispatch(getAdDetailsAction(adId)),
        voteForAd: (adId, rating) => dispatch(voteForAdAction(adId, rating)),
        applyForAd: (adId, params) => dispatch(applyForAdAction(adId, params)),
        getApplications: (adId) => dispatch(getApplicationsAction(adId))
    };
}

export default withRouter(connect(mapState, mapDispatch)(AdDetails));