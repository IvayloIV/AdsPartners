import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Select, Input, Loader } from 'semantic-ui-react';
import SemanticDatepicker from 'react-semantic-ui-datepickers';
import Pagination from '@material-ui/lab/Pagination';
import AdsContainer from './AdsContainer';
import FilterSlider from '../../common/FilterSlider';
import { getAllAdsAction, getAdFiltersAction } from '../../../actions/adActions';

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
    const [size] = useState(6);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [initAdRender, setInitAdRender] = useState(true);
    const [initFilterRender, setInitFilterRender] = useState(true);

    const ads = useSelector(state => state.ad.list);
    const filters = useSelector(state => state.ad.filters);
    const dispatch = useDispatch();

    useEffect(() => {
        (async () => {
            await Promise.all([
                dispatch(getAllAdsAction({ page, size })),
                dispatch(getAdFiltersAction())
            ]);
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

    const onChangeDatepicker = (d, setValue) => {
        if (d == null || d.value == null) {
            setValue(null);
        } else {
            setValue(d.value.map(v => {
                let date = new Date(v);
                let timeZoneOffset = date.getTimezoneOffset() * 60000;
                return new Date(date.getTime() - timeZoneOffset).toISOString();
            }));
        }

        setPage(1);
    };

    const onChangePage = (e, v) => {
        setPage(v);
    };

    if (loading) {
        return <Loader active id="loader" size="large" inline="centered" content="Зареждане..."/>;
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
                        onAfterChange={values => onChangeHandler(values, setRewardsRange)} />
                </div>}
                {minVideos.length > 1 && 
                <div className="ad-filter-container">
                    <span>Брой видеа:</span>
                    <FilterSlider
                        range={minVideos}
                        onAfterChange={values => onChangeHandler(values, setVideosRange)} />
                </div>}
                {minSubscribers.length > 1 && 
                <div className="ad-filter-container">
                    <span>Брой абонати:</span>
                    <FilterSlider
                        range={minSubscribers}
                        onAfterChange={values => onChangeHandler(values, setSubscribersRange)} />
                </div>}
                {minViews.length > 1 && 
                <div className="ad-filter-container">
                    <span>Брой показвания:</span>
                    <FilterSlider
                        range={minViews}
                        onAfterChange={values => onChangeHandler(values, setViewsRange)} />
                </div>}
                <div className="ad-filter-container">
                    <span>Дата на създаване:</span>
                    <SemanticDatepicker
                        locale="bg-BG"
                        format="DD.MM.YYYY"
                        placeholder="От - До"
                        pointing="left"
                        onChange={(e, d) => onChangeDatepicker(d, setCreationDateRange)}
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
                        onChange={(e, d) => onChangeDatepicker(d, setValidToDateRange)}
                        type="range"
                        className="ad-filter-date"
                    />
                </div>
            </div>
            <div className="ad-list-container">
                <div className="ad-list-title">
                    <h2>Рекламни обяви</h2>
                    <span>({ads.totalElements} предложения за партньорство)</span>
                </div>
                <AdsContainer refreshAds={refreshAds} />
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
