import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Select, Input } from 'semantic-ui-react';
import { Range } from 'rc-slider';
import Pagination from '@material-ui/lab/Pagination';
import CompanyInfo from './CompanyInfo';
import { getCompanyListAction, getCompaniesFiltersAction } from '../../actions/companyActions';

export default () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [town, setTown] = useState('');
    const [adsCountRange, setAdsCountRange] = useState([]);
    const [isBlocked, setIsBlocked] = useState(-1);
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(2);
    const [loading, setLoading] = useState(true);
    const [initRender, setInitRender] = useState(true);

    const companies = useSelector(state => state.company.list);
    const filters = useSelector(state => state.company.filters);
    const adCounts = filters.adCounts;
    const dispatch = useDispatch();

    useEffect(() => {
        (async () => {
            await dispatch(getCompanyListAction({ page, size }));
            await dispatch(getCompaniesFiltersAction());
            setLoading(false);
        })();
    }, []);

    useEffect(() => {
        if (initRender) {
            setInitRender(false);
            return;
        }

        dispatch(getCompanyListAction({
            name,
            email,
            town,
            isBlocked: isBlocked >= 0 ? isBlocked : '',
            minAdsCount: adsCountRange[0],
            maxAdsCount: adsCountRange[1],
            size,
            page
        }));
    }, [name, email, town, isBlocked, adsCountRange, page, size]);

    const onChangeHandler = (e, setValue) => {
        setValue(e.target.value);
        setPage(1);
    };

    const onChangeSelectBoxHandler = (e, setValue) => {
        setValue(e.value);
        setPage(1);
    };

    const onChangePage = (e, v) => {
        setPage(v);
    };

    const handleAdsSliderChange = v => {
        setAdsCountRange(v);
        setPage(1);
    };

    if (loading) {
        return <div>{'Loading...'}</div>;
    }

    return (
        <div className="company-ads-block">
            <div className="company-ads-block-wrapper">
                <div className="company-filters">
                    <h2>Филтри</h2>
                    <div className="company-filters-container">
                        <div className="left-filters-container">
                            <div className="company-filter-container">
                                <span>Статус на обявата:</span>
                                <Select 
                                    placeholder='Изберете статус'
                                    className="company-status-filter"
                                    onChange={(e, v) => onChangeSelectBoxHandler(v, setIsBlocked)}
                                    options={[
                                        { value: -1, text: 'Всички' },
                                        { value: 0, text: 'Разрешени' },
                                        { value: 1, text: 'Блокирани' }
                                    ]
                                }/>
                            </div>
                            <div className="company-filter-container">
                                <span>Име на компанията:</span>
                                <Input placeholder='Търси по име' 
                                    onChange={e => onChangeHandler(e, setName)}/>
                            </div>
                            <div className="company-filter-container">
                                <span>Мейл на компанията:</span>
                                <Input placeholder='Търси по мейл' 
                                    onChange={e => onChangeHandler(e, setEmail)}/>
                            </div>
                        </div>
                        <div className="right-filters-container">
                            <div className="company-filter-container">
                                <span>Град на компанията:</span>
                                <Input placeholder='Търси по град' 
                                    onChange={e => onChangeHandler(e, setTown)}/>
                            </div>
                            {adCounts.length > 1 &&
                            <div className="company-filter-container company-slider">
                                <span>Брой обяви на компанията:</span>
                                <Range min={adCounts[0]}
                                    max={adCounts[adCounts.length - 1]}
                                    defaultValue={[adCounts[0], adCounts[adCounts.length - 1]]}
                                    marks={adCounts.reduce((acc, curr) => {
                                        acc[curr] = curr;
                                        return acc;
                                    }, {})}
                                    allowCross={false}
                                    step={null}
                                    onAfterChange={handleAdsSliderChange}/>
                            </div>}
                        </div>
                    </div>
                </div>
                <div className="companies-block">
                    {companies.items.map(company => 
                        <CompanyInfo key={company.id} company={company} />
                    )}
                </div>
                <Pagination
                    id="company-block-pagination"
                    count={companies.totalPages}
                    page={page}
                    color="primary"
                    onChange={onChangePage}
                />
            </div>
        </div>
    );
};

/*class CompanyBlockPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            name: '',
            email: '',
            town: '',
            adsCountRange: [],
            isBlocked: -1,
            page: 1,
            size: 2,
            loading: true
        };

        this.onChangeHandler = this.onChangeHandler.bind(this);
        this.onChangePage = this.onChangePage.bind(this);
    }

    onChangeHandler(e) {
        this.setState({ [e.target.name]: e.target.value, page: 1 }, () => {
            this.refreshAds();
        });
    }

    onChangePage(e, v) {
        this.setState({ page: v }, () => {
            this.refreshAds();
        });
    }

    handleSliderChange(key, value) {
        this.setState({ [key]: value, page: 1 }, () => {
            this.refreshAds();
        });
    }

    refreshAds() {
        let { name, email, town, adsCountRange, isBlocked, page, size } = this.state;

        this.props.getCompaniesByAds({
            name,
            email,
            town,
            isBlocked: isBlocked >= 0 ? isBlocked : '',
            minAdsCount: adsCountRange[0],
            maxAdsCount: adsCountRange[1],
            size,
            page
        });
    }

    async componentDidMount() {
        const { page, size } = this.state;

        try {
            await this.props.getCompaniesByAds({ page, size });
            await this.props.getCompaniesFilters();

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
        
        const { companies, filters } = this.props;
        const { adCounts } = filters;
        const { page } = this.state;

        console.log(companies);

        return (
            <div className="company-block">
                <h2>Filters:</h2>
                <div className="slider-container">
                    <InputLabel>Ad type</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        name="isBlocked"
                        value={this.state.isBlocked}
                        onChange={this.onChangeHandler}>
                        <MenuItem value={-1}>All</MenuItem>
                        <MenuItem value={0}>Allowed</MenuItem>
                        <MenuItem value={1}>Blocked</MenuItem>
                    </Select>
                </div>
                <TextField 
                    label="Name"
                    name="name"
                    onChange={this.onChangeHandler}
                />
                <TextField 
                    label="Email"
                    name="email"
                    onChange={this.onChangeHandler}
                />
                <TextField 
                    label="Town"
                    name="town"
                    onChange={this.onChangeHandler}
                />
                <div className="slider-container">
                    <Typography id="discrete-slider-custom" gutterBottom>
                        Ads count
                    </Typography>
                    <Slider
                        min={adCounts[0]}
                        max={adCounts[adCounts.length - 1]}
                        defaultValue={[adCounts[0], adCounts[adCounts.length - 1]]}
                        onChangeCommitted={(e, v) => this.handleSliderChange('adsCountRange', v)}
                        getAriaValueText={(e) => e}
                        aria-labelledby="discrete-slider-custom"
                        valueLabelDisplay="auto"
                        step={null}
                        marks={adCounts.map(v => {return { value: v }})}/>
                </div>
                <div>
                    {companies.items.map(c => (
                        <div key={c.id}>
                            <hr/>
                            <h2>Company - {c.userName}</h2>
                            <p>Email - {c.userEmail}</p>
                            <p>Town - {c.town}</p>
                            <p>Phone - {c.phone}</p>
                            <p>Ads count - {c.totalAdsCount}</p>
                            {c.ads.length > 0 && <h3>Ads:</h3>}
                            {c.ads.length > 0 && <SliderBox boxes={c.ads.map(a => (
                                <div key={a.id}>
                                    <img src={a.pictureUrl} alt="ad-picture" width="50px" height="30px"/>
                                    <h4>{a.title}</h4>
                                    <div>Reward - {a.reward}</div>
                                    <div>Valid to - {a.validTo}</div>
                                    <div>Avg rating - {a.averageRating}</div>
                                    <Switch
                                        checked={a.isBlocked}
                                        onChange={e => {
                                            if (e.target.checked) {
                                                console.log(companies);
                                                this.props.blockAd(a.id).then(() => {
                                                    console.log(this.props.companies);
                                                });
                                            } else {
                                                this.props.unblockAd(a.id).then(() => {
                                                    console.log(this.props.companies);
                                                });
                                            }
                                        }}
                                        color="primary"
                                    />
                                </div>
                            ))}></SliderBox>}
                        </div>
                    ))}
                    <Pagination 
                        count={companies.totalPages}
                        page={page}
                        color="primary"
                        onChange={this.onChangePage}
                    />
                </div>
            </div>
        )
    }
}

function mapState(state) {
    return {
        companies: state.company.list,
        filters: state.company.filters
    };
}

function mapDispatch(dispatch) {
    return {
        getCompaniesByAds: (params) => dispatch(getCompaniesByAdsAction(params)),
        getCompaniesFilters: () => dispatch(getCompaniesFiltersAction()),
        blockAd: (adId) => dispatch(blockAdAction(adId)),
        unblockAd: (adId) => dispatch(unblockAdAction(adId))
    };
}

export default withRouter(connect(mapState, mapDispatch)(CompanyBlockPage));*/