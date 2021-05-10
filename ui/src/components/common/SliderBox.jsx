import React, { Component } from 'react';

class SliderBox extends Component {
    constructor(props) {
        super(props);

        this.state = {
            position: Math.max(Math.floor(props.boxes.length / 2) - 1, 0)
        };

        this.moveForward = this.moveForward.bind(this);
        this.moveBackward = this.moveBackward.bind(this);
        this.callOnChangeAdId = this.callOnChangeAdId.bind(this);
    }

    moveForward() {
        this.setState({ position: this.state.position + 1 },
            this.callOnChangeAdId)
    }

    moveBackward() {
        this.setState({ position: this.state.position - 1 }, 
            this.callOnChangeAdId);
    }

    callOnChangeAdId() {
        if (this.props.onChangeAdId != null) {
            this.props.onChangeAdId(this.props.boxes[this.state.position].key);
        }
    }

    async componentDidMount() {
        this.callOnChangeAdId();
    }

    render() {
        let boxes = this.props.boxes;
        let position = this.state.position;

        return (
            <div className="slider-boxes">
                <button className="slider-button-left" disabled={position == 0} onClick={this.moveBackward}>
                    {"<<"}
                </button>
                <div className="boxes-wrapper">
                    <div className="boxes" style={{
                        'transform': `translateX(-${position * (100 / boxes.length)}%)`
                    }}>
                    {
                        boxes.map((box, i) => {
                            let activeClass = i == position ? 'box-active': '';
                            return (<div key={i} className={`box ${activeClass}`}>
                                {box}
                            </div>);
                        })
                    }
                    </div>
                </div>
                 <button className="slider-button-right" disabled={position > boxes.length - 2} onClick={this.moveForward}>
                    {">>"}
                 </button>
             </div>
        );
    }
}


export default SliderBox;