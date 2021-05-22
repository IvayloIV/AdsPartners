import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { toast } from 'react-toastify';
import Button from '@material-ui/core/Button';
import Slider from '@material-ui/core/Slider';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Switch from '@material-ui/core/Switch';
import Pagination from '@material-ui/lab/Pagination';
import SliderBox from '../common/SliderBox';
import { getCompaniesFiltersAction, getCompaniesByAdsAction } from '../../actions/companyActions';
import { blockAdAction, unblockAdAction } from '../../actions/adActions';

class CompanyBlockPage extends Component {
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

export default withRouter(connect(mapState, mapDispatch)(CompanyBlockPage));