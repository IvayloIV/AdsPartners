import React, { Fragment } from 'react';
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { Button, Icon } from 'semantic-ui-react';
import SliderBox from '../../common/SliderBox';
import { hasAnyRole } from '../../../utils/AuthUtil';
import { EMPLOYER, ADMIN } from '../../../utils/Roles';

export default () => {
    const applications = useSelector(state => state.application.list);

    if (!hasAnyRole([EMPLOYER, ADMIN]) || applications.length === 0) {
        return <Fragment />
    }

    return (
        <div className="youtuber-applications-to-ad">
            <div className="ad-details-applicatoins-title">
                <h2>Кандидатствания за партньорствa</h2>
            </div>
            <div className="ad-details-applicatoins-container">
                <SliderBox
                    moveGap={2}
                    items={applications.map(a => 
                        <div className="ad-details-applicatoins-wrapper" key={a.id}>
                            <img src={a.youtuber.profilePicture} alt="Youtuber img" />
                            <div className="ad-details-application-info">
                                <h3>{a.youtuber.name}</h3>
                                <div><Icon name="clock outline" /> Дата за заявяване - {new Date(a.applicationDate).toLocaleDateString()}</div>
                                <div className="ad-details-application-button">
                                    <Button color='youtube'
                                        as={NavLink}
                                        to={`/youtuber/details/${a.youtuber.id}`} >
                                        <Icon name="youtube" /> Детайли
                                    </Button>
                                </div>
                            </div>
                        </div>)}
                />
            </div>
        </div>
    );
};
