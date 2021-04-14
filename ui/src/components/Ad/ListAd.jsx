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
import StarBorderIcon from '@material-ui/icons/StarBorder';
import { makeStyles } from '@material-ui/core/styles';
import { getAllAdsAction, getAdsFiltersAction, voteForAdAction } from '../../actions/adActions';
import { getAllCompaniesAction } from '../../actions/companyActions';

class ListAd extends Component {
    constructor(props) {
        super(props);

        this.state = {
            companyId: '',
            title: '',
            description: '',
            startCreationDate: null,
            endCreationDate: null,
            startValidTo: null,
            endValidTo: null,
            rewardsRange: [],
            videosRange: [],
            subscribersRange: [],
            viewsRange: [],
            size: 2,
            page: 1,
            loading: true
        };

        this.onChangeHandler = this.onChangeHandler.bind(this);
        this.refreshAds = this.refreshAds.bind(this);
        this.onChangePage = this.onChangePage.bind(this);
        // this.initBoxFilters = this.initBoxFilters.bind(this);
    }

    onChangeHandler(e) {
        this.setState({ [e.target.name]: e.target.value, page: 1 }, () => {
            // this.initBoxFilters();
            this.refreshAds();
        });
    }

    handleSliderChange(key, value) {
        this.setState({ [key]: value, page: 1 }, () => {
            this.refreshAds();
        });
    }

    onChangePage(e, v) {
        this.setState({ page: v }, () => {
            this.refreshAds();
        });
    }

    // initBoxFilters() {
    //     let { companyId, title, description } = this.state;
    //     this.props.loadFilters({ companyId, title, description })
    //     .then(() => {
    //         let { rewards, minVideos, minSubscribers, minViews }  = this.props.filters;
    //         this.setState({ 
    //             rewardsRange: rewards,
    //             videosRange: minVideos,
    //             subscribersRange: minSubscribers,
    //             viewsRange: minViews,
    //         });
    //     });
    // }

    refreshAds() {
        let {companyId, title, description, startCreationDate, endCreationDate, startValidTo, 
              endValidTo, rewardsRange, videosRange, subscribersRange, viewsRange, size, page} = this.state;
        console.log(title);
        this.props.loadAds({
            companyId,
            title,
            description,
            startCreationDate,
            endCreationDate,
            startValidTo,
            endValidTo,
            minReward: rewardsRange[0],
            maxReward: rewardsRange[1],
            minVideos: videosRange[0],
            maxVideos: videosRange[1],
            minSubscribers: subscribersRange[0],
            maxSubscribers: subscribersRange[1],
            minViews: viewsRange[0],
            maxViews: viewsRange[1],
            size,
            page
        });
    }

    async componentDidMount() {
        let { page, size } = this.state;
        try {
            await this.props.loadAds({ page, size });
            await this.props.loadFilters(null);
            await this.props.loadCompanies();
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
        
        const { items, totalPages } = this.props.ads;
        const { rewards, createdDates, validToDates, minVideos, minSubscribers, minViews } = this.props.filters;
        const { page } = this.state;

        return (
            <div className="dress-remove">
                <div className="slider-container">
                    <InputLabel>Company</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        name="companyId"
                        value={this.state.companyId}
                        onChange={this.onChangeHandler}>
                        {this.props.companies.map((c, i) => {
                            return <MenuItem key={i} value={c.id}>{c.userName}</MenuItem>;
                        })}
                    </Select>
                </div>
                <TextField 
                    id="standard-basic" 
                    label="Title"
                    name="title"
                    onChange={this.onChangeHandler}
                />
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
                <div className="slider-container">
                    <Typography id="discrete-slider-custom" gutterBottom>
                        Reward
                    </Typography>
                    <Slider
                        min={rewards[0]}
                        max={rewards[rewards.length - 1]}
                        defaultValue={[rewards[0], rewards[rewards.length - 1]]}
                        onChangeCommitted={(e, v) => this.handleSliderChange('rewardsRange', v)}
                        getAriaValueText={(e) => e}
                        aria-labelledby="discrete-slider-custom"
                        valueLabelDisplay="auto"
                        step={null}
                        marks={rewards.map(v => {return { value: v }})}/>
                </div>
                <div className="slider-container">
                    <Typography id="discrete-slider-custom" gutterBottom>
                        Videos
                    </Typography>
                    <Slider
                        name="Videos"
                        min={minVideos[0]}
                        max={minVideos[minVideos.length - 1]}
                        defaultValue={[minVideos[0], minVideos[minVideos.length - 1]]}
                        onChangeCommitted={(e, v) => this.handleSliderChange('videosRange', v)}
                        getAriaValueText={(e) => e}
                        aria-labelledby="discrete-slider-custom"
                        valueLabelDisplay="auto"
                        step={null}
                        marks={minVideos.map(v => {return { value: v }})}/>
                </div>
                <div className="slider-container">
                    <Typography id="discrete-slider-custom" gutterBottom>
                        Subscribers
                    </Typography>
                    <Slider
                        name="Subscribers"
                        min={minSubscribers[0]}
                        max={minSubscribers[minSubscribers.length - 1]}
                        defaultValue={[minSubscribers[0], minSubscribers[minSubscribers.length - 1]]}
                        onChangeCommitted={(e, v) => this.handleSliderChange('subscribersRange', v)}
                        getAriaValueText={(e) => e}
                        aria-labelledby="discrete-slider-custom"
                        valueLabelDisplay="auto"
                        step={null}
                        marks={minSubscribers.map(v => {return { value: v }})}/>
                </div>
                <div className="slider-container">
                    <Typography id="discrete-slider-custom" gutterBottom>
                        Views
                    </Typography>
                    <Slider
                        name="Views"
                        min={minViews[0]}
                        max={minViews[minViews.length - 1]}
                        defaultValue={[minViews[0], minViews[minViews.length - 1]]}
                        onChangeCommitted={(e, v) => this.handleSliderChange('viewsRange', v)}
                        getAriaValueText={(e) => e}
                        aria-labelledby="discrete-slider-custom"
                        valueLabelDisplay="auto"
                        step={null}
                        marks={minViews.map(v => {return { value: v }})}/>
                </div>
                <div className="slider-container">
                    <Typography id="discrete-slider-custom" gutterBottom>
                        Created Date
                    </Typography>
                    <TextField
                        id="date"
                        label="From"
                        type="date"
                        mindate={createdDates[0]}
                        maxdate={createdDates[createdDates.length - 1]}
                        onChange={this.onChangeHandler}
                        name="startCreationDate"
                        InputLabelProps={{
                            shrink: true
                        }}
                    />
                    <TextField
                        id="date"
                        label="To"
                        type="date"
                        mindate={createdDates[0]}
                        maxdate={createdDates[createdDates.length - 1]}
                        onChange={this.onChangeHandler}
                        name="endCreationDate"
                        InputLabelProps={{
                            shrink: true
                        }}
                    />
                </div>
                <div className="slider-container">
                    <Typography id="discrete-slider-custom" gutterBottom>
                        Valid to
                    </Typography>
                    <TextField
                        id="date"
                        label="From"
                        type="date"
                        mindate={validToDates[0]}
                        maxdate={validToDates[validToDates.length - 1]}
                        onChange={this.onChangeHandler}
                        name="startValidTo"
                        InputLabelProps={{
                            shrink: true
                        }}
                    />
                    <TextField
                        id="date"
                        label="To"
                        type="date"
                        mindate={validToDates[0]}
                        maxdate={validToDates[validToDates.length - 1]}
                        onChange={this.onChangeHandler}
                        name="endValidTo"
                        InputLabelProps={{
                            shrink: true
                        }}
                    />
                </div>
                {items.map((a, i) => {
                    return <p key={i}>
                        {a.title}
                        <Rating
                            // value={0} TODO...
                            // precision={0.5} TODO...
                            name={`rating-${i}`}
                            emptyIcon={<StarBorderIcon fontSize="inherit"/>}
                            onChange={(e, r) => this.props.voteForAdAction(a.id, r)} 
                        />
                    </p>;
                })}
                <Pagination 
                    count={totalPages}
                    page={page}
                    color="primary"
                    onChange={this.onChangePage}
                />
            </div>
        )
    }
}

function mapState(state) {
    return {
        ads: state.ad.list,
        filters: state.ad.filters,
        companies: state.company.list
    };
}

function mapDispatch(dispatch) {
    return {
        loadAds: (params) => dispatch(getAllAdsAction(params)),
        loadFilters: (params) => dispatch(getAdsFiltersAction(params)),
        loadCompanies: (params) => dispatch(getAllCompaniesAction(params)),
        voteForAdAction: (adId, rating) => dispatch(voteForAdAction(adId, rating))
    };
}

export default withRouter(connect(mapState, mapDispatch)(ListAd));