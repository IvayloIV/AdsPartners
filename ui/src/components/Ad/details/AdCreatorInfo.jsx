import React from 'react';
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { Button } from 'semantic-ui-react';
import { hasRole } from '../../../utils/AuthUtil';
import { EMPLOYER } from '../../../utils/Roles';

export default () => {
    const ad = useSelector(state => state.ad.details);
    
    return (
        <div className="ad-details-company-info">
            <h2>Създател на рекламната обява:</h2>
            <img src={ad.company.logoUrl} alt="Company logo" />
            <h3>{ad.company.userName}</h3>
            <h3>{ad.company.userEmail}</h3>
            <div>
                <Button color='blue'
                    size="large"
                    as={NavLink}
                    to={hasRole(EMPLOYER) ? '/company/profile' : `/company/details/${ad.company.id}`}>
                        Детайли
                </Button>
            </div>
        </div>
    );
};
