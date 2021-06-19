import React from 'react';
import { Button, Icon, Label } from 'semantic-ui-react';

const YoutuberBox = ({ youtuber: y }) => {
    return (
        <div className="youtuber-home" key={y.channelId}>
            <img src={y.profilePicture} alt="Youtuber img"/>
            <div className="youtuber-home-description">
                <h3>{y.name}</h3>
                <Button as='div' labelPosition='right'>
                    <Button color='red' as="a" href={'https://www.youtube.com/channel/' + y.channelId} target="_blank">
                        <Icon name='youtube' />
                        Youtube
                    </Button>
                    <Label basic color='red' pointing='left' as="a" href={'https://www.youtube.com/channel/' + y.channelId} target="_blank">
                        {y.subscriberCount} абонати
                    </Label>
                </Button>
            </div>
        </div>
    );
};

export default YoutuberBox;