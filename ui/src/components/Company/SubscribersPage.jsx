import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { toast } from 'react-toastify';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { getSubscribersAction, changeSubscriberStatusAction } from '../../actions/companyActions';
import TabPanel from '../common/TabPanel';
import Switch from '@material-ui/core/Switch';

class SubscribersPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            tabValue: 0,
            loading: true
        };

        this.onChangeHandler = this.onChangeHandler.bind(this);
        this.onChangeStatus = this.onChangeStatus.bind(this);
    }

    onChangeHandler(e) {
        this.setState({ [e.target.name]: e.target.value });
    }

    onChangeStatus(e, youtuberId) {
        this.props.changeSubscriberStatus(youtuberId, e.target.checked)
            .then(() => {
                this.setState({ tabValue: (this.state.tabValue + 1) % 2 });
            });
    }

    async componentDidMount() {
        try {
            await this.props.loadSubscribers();
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
        
        const subscribers = this.props.subscribers;
        let { tabValue } = this.state;

        console.log(this.props.subscribers);

        return (
            <div className="company-subscribers">
                <Tabs value={tabValue} onChange={(e, v) => this.setState({ tabValue: v })} aria-label="simple tabs example">
                    <Tab label="Allowed Subscribers"/>
                    <Tab label="Blocked Subscribers"/>
                </Tabs>
                <TabPanel value={tabValue} index={0}>
                {subscribers.filter(s => s.isBlocked === false).map((s, i) => (
                    <div key={i}>
                        <img src={s.youtuber.profilePicture} alt="youtuber-image" width="250px" height="200px"/>
                        <h3>{s.youtuber.name}</h3>
                        <p>Subscription date - {s.subscriptionDate}</p>
                        <Switch
                            checked={false}
                            onChange={(c) => this.onChangeStatus(c, s.youtuber.id)}
                            name="checkedA"
                            color="primary"
                        />
                    </div>
                ))}
                </TabPanel>
                <TabPanel value={tabValue} index={1}>
                {subscribers.filter(s => s.isBlocked === true).map((s, i) => (
                    <div key={i}>
                        <img src={s.youtuber.profilePicture} alt="youtuber-image" width="250px" height="200px"/>
                        <h3>{s.youtuber.name}</h3>
                        <p>Subscription date - {s.subscriptionDate}</p>
                        <Switch
                            checked={true}
                            onChange={(c) => this.onChangeStatus(c, s.youtuber.id)}
                            name="checkedA"
                            color="primary"
                        />
                    </div>
                ))}
                </TabPanel>
            </div>
        )
    }
}

function mapState(state) {
    return {
        subscribers: state.company.subscribers,
    };
}

function mapDispatch(dispatch) {
    return {
        loadSubscribers: () => dispatch(getSubscribersAction()),
        changeSubscriberStatus: (youtuberId, status) => dispatch(changeSubscriberStatusAction(youtuberId, status))
    };
}

export default withRouter(connect(mapState, mapDispatch)(SubscribersPage));