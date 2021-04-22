import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getCompanyRequestsAction, getCompanyHistoryAction, updateCompanyStatusAction } from '../../actions/companyActions';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button';

class RegisterRequests extends Component {
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

export default withRouter(connect(mapState, mapDispatch)(RegisterRequests));