import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Select, Input, Loader } from 'semantic-ui-react';
import Pagination from '@material-ui/lab/Pagination';
import CompanyInfo from './CompanyInfo';
import FilterSlider from '../../common/FilterSlider';
import { getCompanyListAction, getCompaniesFiltersAction } from '../../../actions/companyActions';

export default () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [town, setTown] = useState('');
    const [adsCountRange, setAdsCountRange] = useState([]);
    const [isBlocked, setIsBlocked] = useState(-1);
    const [page, setPage] = useState(1);
    const [size] = useState(4);
    const [loading, setLoading] = useState(true);
    const [initRender, setInitRender] = useState(true);

    const companies = useSelector(state => state.company.list);
    const filters = useSelector(state => state.company.filters);
    const adCounts = filters.adCounts;
    const dispatch = useDispatch();

    useEffect(() => {
        (async () => {
            await Promise.all([
                dispatch(getCompanyListAction({ page, size })),
                dispatch(getCompaniesFiltersAction())
            ]);
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
            maxAdsCount: adsCountRange[adsCountRange.length - 1],
            size,
            page
        }));
    }, [name, email, town, isBlocked, adsCountRange, page, size]);

    const onChangeHandler = (v, setValue) => {
        setValue(v);
        setPage(1);
    };

    const onChangePaginationHandler = (e, v) => {
        setPage(v);
    };

    if (loading) {
        return <Loader active id="loader" size="large" inline="centered" content="Зареждане..."/>;
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
                                    onChange={(e, v) => onChangeHandler(v.value, setIsBlocked)}
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
                                    onChange={e => onChangeHandler(e.target.value, setName)}/>
                            </div>
                            <div className="company-filter-container">
                                <span>Мейл на компанията:</span>
                                <Input placeholder='Търси по мейл' 
                                    onChange={e => onChangeHandler(e.target.value, setEmail)}/>
                            </div>
                        </div>
                        <div className="right-filters-container">
                            <div className="company-filter-container">
                                <span>Град на компанията:</span>
                                <Input placeholder='Търси по град' 
                                    onChange={e => onChangeHandler(e.target.value, setTown)}/>
                            </div>
                            {adCounts.length > 1 &&
                            <div className="company-filter-container company-slider">
                                <span>Брой обяви на компанията:</span>
                                <FilterSlider
                                    range={adCounts}
                                    onAfterChange={values => onChangeHandler(values, setAdsCountRange)} />
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
                    onChange={onChangePaginationHandler}
                />
            </div>
        </div>
    );
};
