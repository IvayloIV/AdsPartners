import React from 'react';
import { Icon, Rating } from 'semantic-ui-react';

export default ({ company: c }) => {
    return (
        <div className="company-home" key={c.id}>
            <img src={c.logoUrl} alt="company-logo"/>
            <div className="company-home-description">
                <h3>{c.userName}</h3>
                <div className="company-home-info">
                    <Rating 
                        maxRating={5} 
                        defaultRating={Math.round(c.averageRating)} 
                        disabled={true} 
                        icon='star'
                        size="huge"
                    /> <span className="company-home-rating">({c.averageRating})</span>
                    <p><Icon className='building'/> {c.town}</p>
                </div>
            </div>
        </div>
    );
};
