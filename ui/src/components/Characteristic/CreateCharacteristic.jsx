import React, { Component } from 'react';
import Input from '../common/Input';

class CreateCharacteristic extends Component {
    constructor(props) {
        super(props);

        this.state = {
            name: '',
            value: ''
        };

        this.onChangeHandler = this.onChangeHandler.bind(this);
        this.onClickAddHandler = this.onClickAddHandler.bind(this);
    }

    onChangeHandler(e) {
        this.setState({ [e.target.name]: e.target.value });
    }

    onClickAddHandler(e) {
        const { name, value } = this.state;
        this.props.onSubmitCharHandler(e, name, value);
        this.setState({ name: '', value: '' });
    }

    render() {
        const { name, value } = this.state;

        return (
            <div className="container">
                <h4>Create new characteristic</h4>
                <Input
                    name="name"
                    value={this.state.name}
                    onChange={this.onChangeHandler}
                    label="Name"
                />
                <Input
                    name="value"
                    value={this.state.value}
                    onChange={this.onChangeHandler}
                    label="Value"
                />
                <input type="submit" value="Add" onClick={this.onClickAddHandler} />
            </div>
        );
    }
}

export default CreateCharacteristic;