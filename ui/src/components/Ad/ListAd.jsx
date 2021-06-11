import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from 'react-router-dom';
import { Select, Input, Rating, Button, Icon } from 'semantic-ui-react';
import SemanticDatepicker from 'react-semantic-ui-datepickers';
import Pagination from '@material-ui/lab/Pagination';
import FilterSlider from '../common/FilterSlider';
import { getAllAdsAction, getAdFiltersAction, voteForAdAction } from '../../actions/adActions';

export default () => {
    const [companyId, setCompanyId] = useState('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [creationDateRange, setCreationDateRange] = useState(null);
    const [validToDateRange, setValidToDateRange] = useState(null);
    const [rewardsRange, setRewardsRange] = useState([]);
    const [videosRange, setVideosRange] = useState([]);
    const [subscribersRange, setSubscribersRange] = useState([]);
    const [viewsRange, setViewsRange] = useState([]);
    const [size, setSize] = useState(6);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [initAdRender, setInitAdRender] = useState(true);
    const [initFilterRender, setInitFilterRender] = useState(true);

    const ads = useSelector(state => state.ad.list);
    const filters = useSelector(state => state.ad.filters);
    const dispatch = useDispatch();

    useEffect(() => {
        (async () => {
            await dispatch(getAllAdsAction({ page, size }));
            await dispatch(getAdFiltersAction());
            setLoading(false);
        })();
    }, []);

    useEffect(() => {
        if (initAdRender) {
            setInitAdRender(false);
            return;
        }

        refreshAds();
    }, [creationDateRange, validToDateRange, rewardsRange, videosRange, subscribersRange, viewsRange, page, size]);

    useEffect(() => {
        if (initFilterRender) {
            setInitFilterRender(false);
            return;
        }

        setRewardsRange([]);
        setVideosRange([]);
        setSubscribersRange([]);
        setViewsRange([]);
        dispatch(getAdFiltersAction({ companyId, title, description }));
    }, [companyId, title, description]);

    const refreshAds = () => {
        dispatch(getAllAdsAction({
            companyId,
            title,
            description,
            startCreationDate: creationDateRange !== null ? creationDateRange[0] : undefined,
            endCreationDate: creationDateRange !== null ? creationDateRange[1] : undefined,
            startValidTo: validToDateRange !== null ? validToDateRange[0] : undefined,
            endValidTo: validToDateRange !== null ? validToDateRange[1] : undefined,
            minReward: rewardsRange[0],
            maxReward: rewardsRange[rewardsRange.length - 1],
            minVideos: videosRange[0],
            maxVideos: videosRange[videosRange.length - 1],
            minSubscribers: subscribersRange[0],
            maxSubscribers: subscribersRange[subscribersRange.length - 1],
            minViews: viewsRange[0],
            maxViews: viewsRange[viewsRange.length - 1],
            size,
            page,
            isBlocked: 0
        }));
    };

    const onChangeHandler = (v, setValue) => {
        setValue(v);
        setPage(1);
    };

    const onChangeDatepicker = (e, d, setValue) => {
        if (d == null || d.value == null) {
            setValue(null);
        } else {
            setValue(d.value.map(v => {
                let date = new Date(v);
                let timeZoneOffset = date.getTimezoneOffset() * 60000
                return new Date(date.getTime() - timeZoneOffset).toISOString();
            }));
        }

        setPage(1);
    };

    const onChangePage = (e, v) => {
        setPage(v);
    };

    const voteForAdHandler = async (adId, rating) => { 
        await dispatch(voteForAdAction(adId, rating));
        refreshAds();
    };

    if (loading) {
        return <div>{'Loading...'}</div>;
    }

    const { companies, rewards, minVideos, minSubscribers, minViews } = filters;

    const companiesSelectOptions = () => {
        let companiesValues = companies.map(c => {
            return { value: c.id, text: c.userName }; 
        });

        companiesValues.unshift({ value: '', text: 'Всички' });
        return companiesValues;
    };

    return (
        <div className="ad-list">
            <div className="ad-list-filters">
                <h2>Филтри</h2>
                <div className="ad-filter-container">
                    <span>Компания:</span>
                    <Select 
                        placeholder='Изберете компания'
                        onChange={(e, o) => onChangeHandler(o.value, setCompanyId)}
                        options={companiesSelectOptions()}
                    />
                </div>
                <div className="ad-filter-container">
                    <span>Заглавие:</span>
                    <Input placeholder='Търси по заглавие'
                        onChange={e => onChangeHandler(e.target.value, setTitle)}/>
                </div>
                <div className="ad-filter-container">
                    <span>Описание:</span>
                    <Input placeholder='Ключова дума'
                        onChange={e => onChangeHandler(e.target.value, setDescription)}/>
                </div>
                {rewards.length > 1 && 
                <div className="ad-filter-container">
                    <span>Възнаграждение/&euro;:</span>
                    <FilterSlider
                        range={rewards}
                        onAfterChange={values => setRewardsRange(values)} />
                </div>}
                {minVideos.length > 1 && 
                <div className="ad-filter-container">
                    <span>Брой видеа:</span>
                    <FilterSlider
                        range={minVideos}
                        onAfterChange={values => setVideosRange(values)} />
                </div>}
                {minSubscribers.length > 1 && 
                <div className="ad-filter-container">
                    <span>Брой абонати:</span>
                    <FilterSlider
                        range={minSubscribers}
                        onAfterChange={values => setSubscribersRange(values)} />
                </div>}
                {minViews.length > 1 && 
                <div className="ad-filter-container">
                    <span>Брой показвания:</span>
                    <FilterSlider
                        range={minViews}
                        onAfterChange={values => setViewsRange(values)} />
                </div>}
                <div className="ad-filter-container">
                    <span>Дата на създаване:</span>
                    <SemanticDatepicker
                        locale="bg-BG"
                        format="DD.MM.YYYY"
                        placeholder="От - До"
                        pointing="left"
                        onChange={(e, d) => onChangeDatepicker(e, d, setCreationDateRange)}
                        type="range"
                        className="ad-filter-date"
                    />
                </div>
                <div className="ad-filter-container">
                    <span>Дата на валидност:</span>
                    <SemanticDatepicker
                        locale="bg-BG"
                        format="DD.MM.YYYY"
                        placeholder="От - До"
                        pointing="left"
                        onChange={(e, d) => onChangeDatepicker(e, d, setValidToDateRange)}
                        type="range"
                        className="ad-filter-date"
                    />
                </div>
            </div>
            <div className="ad-list-container">
                <div className="ad-list-title">
                    <h2>Рекламни обяви</h2>
                    <span>({ads.totalElements} предложения за партнюрство)</span>
                </div>
                <div className="ad-list-items">
                    {ads.totalElements === 0 &&
                        <div className="ad-list-not-found">Не са намерени обяви по зададените критерий.</div>}
                    {ads.items.map(a => {
                        const outOfDate = new Date(a.validTo) - new Date() < 0;

                        return (<div key={a.id} className="ad-list-item-wrapper">
                            <div className="ad-list-img-wrapper">
                                <img src={a.pictureUrl} alt="Ad picture" className={outOfDate ? "ad-list-item-expired" : ''} />
                                {outOfDate && <div>Обявата е изтекла</div>}
                            </div>
                            <h2>{a.title}</h2>
                            <div className="ad-list-rating">
                                <Rating 
                                    maxRating={5} 
                                    defaultRating={a.ratingResponse != null ? a.ratingResponse.rating : 0} 
                                    disabled={a.ratingResponse != null || outOfDate}
                                    onRate={(e, v) => voteForAdHandler(a.id, v.rating)}
                                    icon='star'
                                    size="huge"
                                /> <span className="ad-list-rating-text">({Number(a.averageRating.toFixed(2))})</span>
                            </div>
                            <h3>Възнаграждение: {a.reward} &euro;</h3>
                            <div className="ad-list-requirements">
                                <h4>Минимален брой:</h4>
                                <ul>
                                    <li>видеа - {a.minVideos || 0}</li>
                                    <li>абонати - {a.minSubscribers || 0}</li>
                                    <li>показвания - {a.minViews || 0}</li>
                                </ul>
                            </div>
                            <div className="ad-list-date">
                                <Icon name="clock outline" /> 
                                Дата на създаване: <span>{new Date(a.creationDate).toLocaleDateString()}</span></div>
                            <div className="ad-list-date">
                                <Icon name="clock outline" /> 
                                Валидна до: <span>{new Date(a.validTo).toLocaleDateString()}</span>
                            </div>
                            <div className="ad-list-details">
                                <Button inverted 
                                    color='orange'
                                    as={NavLink}
                                    to={`/ad/details/${a.id}`}>
                                    <Icon name="briefcase" /> Детайли
                                </Button>
                            </div>
                        </div>);
                    })}
                </div>
                {ads.totalElements > 0 && <div className="ad-list-pagination">
                    <Pagination 
                        count={ads.totalPages}
                        page={page}
                        color="primary"
                        onChange={onChangePage}
                    />
                </div>}
            </div>
        </div>
    );
};

/*class ListAd extends Component {
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
            page,
            isBlocked: false
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
                        <Link className="details" to={`/ad/details/${a.id}`}>Details</Link>
                        <Link className="company-details" to={`/company/details/${a.company.id}`}>Company Details</Link>
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

export default withRouter(connect(mapState, mapDispatch)(ListAd));*/