import React from 'react';
import { NavLink } from 'react-router-dom';
import Switch from '@material-ui/core/Switch';
import { Button } from 'semantic-ui-react';

export default ({ subscriber : s, onChangeStatus }) => {
    return (
        <div className="subscription-youtuber-container">
            <div className="subscription-youtuber-img">
                <img src={s.youtuber.profilePicture} alt="Youtuber img" />
            </div>
            <div className="subscription-youtuber-info">
                <h2>{s.youtuber.name}</h2>
                <h3>{s.youtuber.email}</h3>
                <div>Дата на абониране - {new Date(s.subscriptionDate).toLocaleDateString()}</div>
                <div className="subscription-youtuber-block">
                    <span>Блокиран: </span>
                    <Switch
                        checked={s.isBlocked}
                        onChange={c => onChangeStatus(c, s.youtuber.id)}
                        color="primary"
                    />
                </div>
                <div className="subscription-youtuber-details">
                    <Button inverted 
                        color='violet'
                        as={NavLink}
                        to={`/youtuber/details/${s.youtuber.id}`}>
                            Детайли
                    </Button>
                </div>
            </div>
        </div>
    );
};
