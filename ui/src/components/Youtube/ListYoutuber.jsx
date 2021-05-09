import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Slider from '@material-ui/core/Slider';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Pagination from '@material-ui/lab/Pagination';
import Rating from '@material-ui/lab/Rating';
import Chip from '@material-ui/core/Chip';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import { getYoutubersAction, getYoutubersFiltersAction, voteForYoutuberAction } from '../../actions/youtubeActions';

class ListYoutuber extends Component {
    constructor(props) {
        super(props);

        this.state = {
            name: '',
            description: '',
            startPublishedAt: null,
            endPublishedAt: null,
            subscribersRange: [],
            videosRange: [],
            viewsRange: [],
            size: 2,
            page: 1,
            loading: true
        };

        this.onChangeHandler = this.onChangeHandler.bind(this);
        this.refreshAds = this.refreshAds.bind(this);
        this.onChangePage = this.onChangePage.bind(this);
        this.removeParam = this.removeParam.bind(this);
    }

    onChangeHandler(e) {
        this.setState({ [e.target.name]: e.target.value, page: 1 }, () => {
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

    refreshAds() {
        let { name, description, startPublishedAt, endPublishedAt, subscribersRange, 
            videosRange, viewsRange, size, page } = this.state;
        const { subscribersCount, videosCount, viewsCount } = this.props.filters;

        let params = {
            name,
            description,
            startPublishedAt,
            endPublishedAt,
            size,
            page
        };

        this.addParam(subscribersRange[0], subscribersCount, 'minSubscriberCount', params);
        this.addParam(subscribersRange[1], subscribersCount, 'maxSubscriberCount', params);
        this.addParam(videosRange[0], videosCount, 'minVideoCount', params);
        this.addParam(videosRange[1], videosCount, 'maxVideoCount', params);
        this.addParam(viewsRange[0], viewsCount, 'minViewCount', params);
        this.addParam(viewsRange[1], viewsCount, 'maxViewCount', params);

        this.props.loadYoutubers(params);
    }

    addParam(value, range, name, params) {
        if (value > range[0] && value < range[range.length - 1]) {
            params[name] = value;
        }
    }

    removeParam(element) {
        let param = element.split('=')[0];
        if (param === 'name') {
            this.setState({ name: '' }, () => {
                this.refreshAds();
            });
        }
    }

    async componentDidMount() {
        let { page, size } = this.state;
        try {
            await this.props.loadYoutubers({ page, size });
            await this.props.loadFilters();
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
        
        const { items, totalPages, queryParams } = this.props.youtubers;
        const { subscribersCount, videosCount, viewsCount, publishesAt } = this.props.filters;
        const { name, page } = this.state;

        return (
            <div className="dress-remove">
                <TextField 
                    id="standard-basic" 
                    label="Name"
                    name="name"
                    value={name}
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
                        Subscribers
                    </Typography>
                    <Slider
                        name="Subscribers"
                        min={subscribersCount[0]}
                        max={subscribersCount[subscribersCount.length - 1]}
                        defaultValue={[subscribersCount[0], subscribersCount[subscribersCount.length - 1]]}
                        onChangeCommitted={(e, v) => this.handleSliderChange('subscribersRange', v)}
                        getAriaValueText={(e) => e}
                        aria-labelledby="discrete-slider-custom"
                        valueLabelDisplay="auto"
                        step={null}
                        marks={subscribersCount.map(v => {return { value: v }})}/>
                </div>
                <div className="slider-container">
                    <Typography id="discrete-slider-custom" gutterBottom>
                        Videos
                    </Typography>
                    <Slider
                        name="Videos"
                        min={videosCount[0]}
                        max={videosCount[videosCount.length - 1]}
                        defaultValue={[videosCount[0], videosCount[videosCount.length - 1]]}
                        onChangeCommitted={(e, v) => this.handleSliderChange('videosRange', v)}
                        getAriaValueText={(e) => e}
                        aria-labelledby="discrete-slider-custom"
                        valueLabelDisplay="auto"
                        step={null}
                        marks={videosCount.map(v => {return { value: v }})}/>
                </div>
                <div className="slider-container">
                    <Typography id="discrete-slider-custom" gutterBottom>
                        Views
                    </Typography>
                    <Slider
                        name="Views"
                        min={viewsCount[0]}
                        max={viewsCount[viewsCount.length - 1]}
                        defaultValue={[viewsCount[0], viewsCount[viewsCount.length - 1]]}
                        onChangeCommitted={(e, v) => this.handleSliderChange('viewsRange', v)}
                        getAriaValueText={(e) => e}
                        aria-labelledby="discrete-slider-custom"
                        valueLabelDisplay="auto"
                        step={null}
                        marks={viewsCount.map(v => {return { value: v }})}/>
                </div>
                <div className="slider-container">
                    <Typography id="discrete-slider-custom" gutterBottom>
                        Published At
                    </Typography>
                    <TextField
                        id="date"
                        label="From"
                        type="date"
                        mindate={publishesAt[0]}
                        maxdate={publishesAt[publishesAt.length - 1]}
                        onChange={this.onChangeHandler}
                        name="startPublishedAt"
                        InputLabelProps={{
                            shrink: true
                        }}
                    />
                    <TextField
                        id="date"
                        label="To"
                        type="date"
                        mindate={publishesAt[0]}
                        maxdate={publishesAt[publishesAt.length - 1]}
                        onChange={this.onChangeHandler}
                        name="endPublishedAt"
                        InputLabelProps={{
                            shrink: true
                        }}
                    />
                </div>
                {queryParams.substr(1).split('&').filter(e => !e.startsWith('page') && !e.startsWith('size')).map((c, i) => (
                    <Chip key={'item-' + i}
                        color="primary"
                        label={c}
                        onDelete={() => this.removeParam(c)} />
                ))}
                {items.map(u => {
                    return <div key={u.id}>
                        <img src={u.profilePicture} alt="User profile picture" width="250px" height="200px"/>
                        <h3>{u.name}, {u.publishedAt}</h3>
                        <p>{u.email}</p>
                        <p>{u.subscriberCount}, {u.videoCount}, {u.viewCount}</p>
                        <Link className="details" to={`/youtuber/details/${u.id}`}>User profile</Link>
                        <Link className="company-details" to={`/youtuber/send/${u.id}`}>Offer partnership</Link>
                        <Rating
                            // value={0} TODO...
                            // precision={0.5} TODO...
                            name={`rating-${u.id}`}
                            emptyIcon={<StarBorderIcon fontSize="inherit"/>}
                            onChange={(e, r) => this.props.voteForYoutuber(u.id, r)} 
                        />
                        ({u.averageRating})
                    </div>;
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
        youtubers: state.youtube.list,
        filters: state.youtube.filters
    };
}

function mapDispatch(dispatch) {
    return {
        loadYoutubers: (params) => dispatch(getYoutubersAction(params)),
        loadFilters: () => dispatch(getYoutubersFiltersAction()),
        voteForYoutuber: (youtuberId, rating) => dispatch(voteForYoutuberAction(youtuberId, rating))
    };
}

export default withRouter(connect(mapState, mapDispatch)(ListYoutuber));