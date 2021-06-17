import React from 'react';
import { useSelector } from "react-redux";
import { NavLink } from 'react-router-dom';
import { Table, Button } from 'semantic-ui-react';
import { hasRole } from '../../../utils/AuthUtil';
import { YOUTUBER } from '../../../utils/Roles';

export default () => {
    let applications;

    if (hasRole(YOUTUBER)) {
        const youtuberDetails = useSelector(state => state.youtube.details);
        applications = youtuberDetails.adApplicationList;
    } else {
        applications = useSelector(state => state.application.list);
    }

    return (
        <Table.Body>
            {applications.map(a => (
                <Table.Row key={a.ad.id} textAlign="left">
                    <Table.Cell textAlign="center">
                        <span className="youtuber-details-application-img">
                            <img src={a.ad.pictureUrl} alt="Ad picture" />
                        </span>
                    </Table.Cell>
                    <Table.Cell>{a.ad.title}</Table.Cell>
                    <Table.Cell>{new Date(a.applicationDate).toLocaleDateString()}</Table.Cell>
                    <Table.Cell>{a.description}</Table.Cell>
                    <Table.Cell textAlign="right">{a.ad.reward} &euro;</Table.Cell>
                    <Table.Cell textAlign="center">
                        <Button color="orange"
                            className="medium"
                            as={NavLink}
                            to={`/ad/details/${a.ad.id}`}>
                                Детайли
                        </Button>
                    </Table.Cell>
                </Table.Row>
            ))}
        </Table.Body>
    );
};
