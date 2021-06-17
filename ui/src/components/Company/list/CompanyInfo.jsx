import React, { useState } from 'react';
import { NavLink } from "react-router-dom";
import { Icon, Button } from 'semantic-ui-react';
import CompanyAds from './CompanyAds';

export default props => {
    const [isAdsActive, setIsAdsActive] = useState(false);
    const c = props.company;

    return (
        <div>
            <div className="company-block" key={c.id}>
                <img src={c.logoUrl} alt="Company logo" />
                <div className="company-block-info">
                    <h3>{c.userName}</h3>
                    <span className="company-email">{c.userEmail}</span>
                    <span><Icon name="building"/>{c.town}</span>
                    <span><Icon name="phone"/>{c.phone}</span>
                    <span>Брой обяви - {c.adsCount}</span>
                </div>
                <div className="company-block-control">
                    <Button 
                        color='orange'
                        id="company-details-button"
                        as={NavLink}
                        to={`/company/details/${c.id}`}>
                        Детайли
                    </Button>
                    {c.adsCount > 0 && <Button 
                        color='red'
                        id="show-ads-button"
                        toggle={isAdsActive}
                        onClick={() => setIsAdsActive(!isAdsActive)}>
                        {isAdsActive ? 'Скрий обявите' : 'Виж обявите'}
                    </Button>}
                </div>
            </div>
            <div className="company-ads-block-container" id={isAdsActive ? 'company-ads-block-active' : ''}>
                {c.ads.map(ad => 
                    <CompanyAds
                        key={ad.id}
                        ad={ad}
                        companyId={c.id}
                        isAdsActive={isAdsActive}
                    />
                )}
            </div>
        </div>
    );
};
