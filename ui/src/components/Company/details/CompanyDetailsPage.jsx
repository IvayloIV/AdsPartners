import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { TextArea, Icon, Button, Loader } from 'semantic-ui-react';
import SliderBox from '../../common/SliderBox';
import AdCard from './AdCard';
import { getCompanyAdsAction, getCompanyAdsByIdAction } from '../../../actions/adActions';
import { getApplicationsByCompanyAction } from '../../../actions/applicationActions';
import { getCompanyDetailsAction, getCompanyProfileAction } from '../../../actions/companyActions';
import { subscribeAction, checkSubscriptionAction } from '../../../actions/subscriptionActions';
import { hasRole } from '../../../utils/AuthUtil';
import { EMPLOYER, YOUTUBER } from '../../../utils/Roles';

export default props => {
    const [loading, setLoading] = useState(true);

    const companyDetails = useSelector(state => state.company.details);
    const ads = useSelector(state => state.ad.list.items);
    const applications = useSelector(state => state.application.list);
    const isSubscriber = useSelector(state => state.subscription.isSubscriber);
    const dispatch = useDispatch();

    useEffect(() => {
        (async () => {
            const companyId = props.match.params.companyId;

            if (companyId) {
                await Promise.all([
                    dispatch(getCompanyDetailsAction(companyId)),
                    dispatch(getCompanyAdsByIdAction(companyId))
                ]);
            } else {
                await Promise.all([
                    dispatch(getCompanyProfileAction()),
                    dispatch(getCompanyAdsAction())
                ]);
            }

            if (hasRole(YOUTUBER)) {
                await Promise.all([
                    dispatch(getApplicationsByCompanyAction(companyId)),
                    dispatch(checkSubscriptionAction(companyId))
                ]);
            }

            setLoading(false);
        })();
    }, []);

    if (loading) {
        return <Loader active id="loader" size="large" inline="centered" content="Зареждане..."/>;
    }

    const availableAds = ads.filter(a => !a.isBlocked && new Date(a.validTo) - new Date() >= 0);
    const outdatedAds = ads.filter(a => !a.isBlocked && new Date(a.validTo) - new Date() < 0);
    const blockedAds = ads.filter(a => a.isBlocked);
    
    return (
        <div className="company-details">
            <div className="company-details-title">
                <h2>Профил на компанията</h2>
                <hr />
            </div>
            <div className="company-details-info">
                <div className="company-details-left-info">
                    <img src={companyDetails.logoUrl} alt="Company logo"/>
                    <h2>{companyDetails.userName}</h2>
                    <h3>{companyDetails.userEmail}</h3>
                    <div>Дата на създаване: {new Date(companyDetails.companyCreationDate).toLocaleDateString()}</div>
                    <div>Дата на регистрация: {new Date(companyDetails.userCreatedDate).toLocaleDateString()}</div>
                </div>
                <div className="company-details-right-info">
                    <div className="company-details-description">
                        <h3>Описание на дейността:</h3>
                        <TextArea
                            id="company-details-description-textarea"
                            value={companyDetails.description}
                            disabled={true} />
                    </div>
                    <div className="company-details-props">
                        <div className="company-details-prop">
                            <span><Icon name="phone" /> Телефон </span>
                            <span>{companyDetails.phone}</span>
                        </div>
                        <div className="company-details-prop">
                            <span><Icon name="money bill alternate outline" /> Приходи </span>
                            <span>{companyDetails.incomeLastYear} &euro;</span>
                        </div>
                        <div className="company-details-prop">
                            <span><Icon name="building outline" /> Град </span>
                            <span>{companyDetails.town}</span>
                        </div>
                        <div className="company-details-prop">
                            <span><Icon name="users" /> Брой служители </span>
                            <span>{companyDetails.workersCount}</span>
                        </div>
                    </div>
                    <div className="company-details-buttons">
                        {(hasRole(YOUTUBER) && !isSubscriber) &&
                            <Button inverted
                                color="orange"
                                size="large"
                                onClick={() => dispatch(subscribeAction(companyDetails.id))}>
                                Абонирай се
                            </Button>
                        }
                    </div>
                </div>
            </div>
            {availableAds.length > 0 && <div className="company-available-ads">
                <div className="company-details-title">
                    <h2>Текущи обяви - {availableAds.length}</h2>
                    <hr />
                </div>
                <div className="company-details-ads-container">
                    <SliderBox 
                        items={availableAds.map(a => <AdCard key={a.id} ad={a} isOwner={hasRole(EMPLOYER)} />)}
                    />
                </div>
            </div>}
            {outdatedAds.length > 0 && <div className="company-outdate-ads">
                <div className="company-details-title">
                    <h2>Изтекли обяви - {outdatedAds.length}</h2>
                    <hr />
                </div>
                <div className="company-details-ads-container">
                    <SliderBox 
                        items={outdatedAds.map(a => <AdCard key={a.id} isHidden={false} ad={a} />)}
                    />
                </div>
            </div>}
            {blockedAds.length > 0 && <div className="company-blocked-ads">
                <div className="company-details-title">
                    <h2>Блокирани обяви - {blockedAds.length}</h2>
                    <hr />
                </div>
                <div className="company-details-ads-container">
                    <SliderBox 
                        items={blockedAds.map(a => <AdCard key={a.id} isHidden={false} ad={a} />)}
                    />
                </div>
            </div>}
            {(hasRole(YOUTUBER) && applications.length > 0) && <div className="youtuber-applications-to-company">
                <div className="company-details-title">
                    <h2>Кандидатствания за партньорствa - {applications.length}</h2>
                    <hr />
                </div>
                <div className="company-details-ads-container">
                    <SliderBox 
                        items={applications.map(a => 
                            <AdCard 
                                key={a.ad.id}
                                ad={a.ad}
                                isHidden={true}
                                validToText={`Дата на заявката - ${new Date(a.applicationDate).toLocaleDateString()}`}
                            />)}
                    />
                </div>
            </div>}
        </div>
    );
};
