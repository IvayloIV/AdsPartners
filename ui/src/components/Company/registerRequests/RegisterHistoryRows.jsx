import React from 'react';
import { useSelector } from "react-redux";
import { Table } from 'semantic-ui-react'

export default () => {
    const history = useSelector(state => state.company.history);

    return (
        <Table.Body className="company-history-body">
            {history.map(r => (
                <Table.Row key={r.id} id="company-history-row" className={r.status.toLowerCase()} textAlign="center">
                    <Table.Cell>{r.userName}</Table.Cell>
                    <Table.Cell>{r.userEmail}</Table.Cell>
                    <Table.Cell>{r.phone}</Table.Cell>
                    <Table.Cell>{new Date(r.userCreatedDate).toLocaleString()}</Table.Cell>
                    <Table.Cell>{new Date(r.statusModifyDate).toLocaleString()}</Table.Cell>
                    <Table.Cell>{r.status === 'ALLOWED' ? 'Одобрено' : 'Забранено'}</Table.Cell>
                </Table.Row>
            ))}
        </Table.Body>
    );
};
