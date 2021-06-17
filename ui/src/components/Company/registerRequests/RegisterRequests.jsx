import React, { useEffect, useState } from 'react';
import { useDispatch } from "react-redux";
import { Table, Loader } from 'semantic-ui-react'
import RequestTableRows from './RequestTableRows';
import RegisterHistoryRows from './RegisterHistoryRows';
import { getCompanyRequestsAction, getCompaniesHistoryAction } from '../../../actions/companyActions';

export default () => {
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();

    useEffect(() => {
        (async () => {
            await Promise.all([
                dispatch(getCompanyRequestsAction()),
                dispatch(getCompaniesHistoryAction())
            ]);
            setLoading(false);
        })();
    }, []);

    if (loading) {
        return <Loader active id="loader" size="large" inline="centered" content="Зареждане..."/>;
    }

    return (
        <div className="company-requests">
            <h2 id="company-requests-title">Заявни на компаниите</h2>
            <Table id="company-register-table" color='blue' key='company-register-table'>
                <Table.Header>
                    <Table.Row textAlign="center">
                        <Table.HeaderCell>Име</Table.HeaderCell>
                        <Table.HeaderCell>Мейл</Table.HeaderCell>
                        <Table.HeaderCell>Телефон</Table.HeaderCell>
                        <Table.HeaderCell>Дата на заявката</Table.HeaderCell>
                        <Table.HeaderCell>Действия</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <RequestTableRows />
            </Table>
            <hr/>
            <h2 id="company-history-title">История на обработените заявки</h2>
            <Table id="company-history-table" color='yellow' key='company-history-table'>
                <Table.Header>
                    <Table.Row textAlign="center">
                        <Table.HeaderCell>Име</Table.HeaderCell>
                        <Table.HeaderCell>Мейл</Table.HeaderCell>
                        <Table.HeaderCell>Телефон</Table.HeaderCell>
                        <Table.HeaderCell>Дата на заявката</Table.HeaderCell>
                        <Table.HeaderCell>Дата на промяната</Table.HeaderCell>
                        <Table.HeaderCell>Статус</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <RegisterHistoryRows />
            </Table>
        </div>
    );
};
