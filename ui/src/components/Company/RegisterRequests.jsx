import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { Table, Button } from 'semantic-ui-react'
import { getCompanyRequestsAction, getCompaniesHistoryAction, updateCompanyStatusAction } from '../../actions/companyActions';

export default () => {
    const [loading, setLoading] = useState(true);

    const requests = useSelector(state => state.company.requests);
    const history = useSelector(state => state.company.history);
    const dispatch = useDispatch();

    useEffect(() => {
        (async () => {
            await dispatch(getCompanyRequestsAction());
            await dispatch(getCompaniesHistoryAction());
            setLoading(false);
        })();
    }, []);

    if (loading) {
        return <div>{'Loading...'}</div>;
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
            </Table>
        </div>
    );
};

/*class RegisterRequests extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: true
        };
    }

    async componentDidMount() {
        try {
            await this.props.getCompanyRequests();
            await this.props.getCompanyHistory();
            this.setState({ loading: false });
        } catch (err) {
            toast.error(err.message);
            // this.props.history.push('/');
        }
    }

    render() {
        if (this.state.loading) {
            return <div>{'Loading...'}</div>;
        }
        
        const { requests, history } = this.props;

        return (
            <div className="company-requests">
                <h2>Requests</h2>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                        <TableRow>
                            <TableCell align="center">Name</TableCell>
                            <TableCell align="center">Email</TableCell>
                            <TableCell align="center">Phone</TableCell>
                            <TableCell align="center">Request date</TableCell>
                            <TableCell align="center">Actions</TableCell>
                        </TableRow>
                        </TableHead>
                        <TableBody>
                            {requests.map(r => (
                                <TableRow key={r.id}>
                                    <TableCell align="center">{r.userName}</TableCell>
                                    <TableCell align="center">{r.userEmail}</TableCell>
                                    <TableCell align="center">{r.phone}</TableCell>
                                    <TableCell align="center">{r.userCreatedDate}</TableCell>
                                    <TableCell align="center">
                                        <Button color="primary"
                                                onClick={(e) => this.props.updateCompanyStatus(r.id, 'ALLOWED')}>
                                            OK
                                        </Button>
                                        <Button color="secondary"
                                                onClick={(e) => this.props.updateCompanyStatus(r.id, 'BLOCKED')}>
                                            NOP
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <h2>History</h2>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                        <TableRow>
                            <TableCell align="center">Name</TableCell>
                            <TableCell align="center">Email</TableCell>
                            <TableCell align="center">Phone</TableCell>
                            <TableCell align="center">Request date</TableCell>
                            <TableCell align="center">Modified date</TableCell>
                            <TableCell align="center">Status</TableCell>
                        </TableRow>
                        </TableHead>
                        <TableBody>
                            {history.map(r => (
                                <TableRow key={r.id}>
                                    <TableCell align="center">{r.userName}</TableCell>
                                    <TableCell align="center">{r.userEmail}</TableCell>
                                    <TableCell align="center">{r.phone}</TableCell>
                                    <TableCell align="center">{r.userCreatedDate}</TableCell>
                                    <TableCell align="center">{r.statusModifyDate}</TableCell>
                                    <TableCell align="center">{r.status}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        )
    }
}

function mapState(state) {
    return {
        requests: state.company.requests,
        history: state.company.history
    };
}

function mapDispatch(dispatch) {
    return {
        getCompanyRequests: () => dispatch(getCompanyRequestsAction()),
        getCompanyHistory: () => dispatch(getCompanyHistoryAction()),
        updateCompanyStatus: (companyId, status) => dispatch(updateCompanyStatusAction(companyId, status))
    };
}

export default withRouter(connect(mapState, mapDispatch)(RegisterRequests));*/