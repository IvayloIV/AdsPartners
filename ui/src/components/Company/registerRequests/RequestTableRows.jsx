import React from 'react';
import { useSelector, useDispatch } from "react-redux";
import { Table, Button } from 'semantic-ui-react'
import { updateCompanyStatusAction } from '../../../actions/companyActions';

export default () => {
    const requests = useSelector(state => state.company.requests);
    const dispatch = useDispatch();

    return (
        <Table.Body className="company-request-body">
            {requests.map(r => (
                <Table.Row key={r.id} id="company-request-row" textAlign="center">
                <Table.Cell>{r.userName}</Table.Cell>
                <Table.Cell>{r.userEmail}</Table.Cell>
                <Table.Cell>{r.phone}</Table.Cell>
                <Table.Cell>{new Date(r.userCreatedDate).toLocaleString()}</Table.Cell>
                <Table.Cell>
                    <Button.Group>
                        <Button inverted color='blue'
                                onClick={() => dispatch(updateCompanyStatusAction(r.id, 'ALLOWED'))}>
                            Одобри
                        </Button>
                        <Button inverted color='red'
                                onClick={() => dispatch(updateCompanyStatusAction(r.id, 'BLOCKED'))}>
                            Забрани
                        </Button>
                    </Button.Group>
                </Table.Cell>
            </Table.Row>
            ))}
        </Table.Body>
    );
};
