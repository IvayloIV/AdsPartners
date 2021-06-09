import React, { useState, useEffect } from 'react';
import { Range } from 'rc-slider';

export default ({ range, onAfterChange }) => {
    const [values, setValues] = useState([]);

    useEffect(() => {
        setValuesHandler(range);
    }, [range]);

    const setValuesHandler = (newValues) => {
        setValues([newValues[0] === null ? 0 : newValues[0], newValues[newValues.length - 1]]);
    };

    const sliderReducer = (acc, curr) => {
        if (curr === null) {
            acc['0'] = 0;
        } else {
            acc['' + curr] = curr;
        }
        return acc;
    };

    return (
        <div className="slider-filter">
            <Range min={range[0]}
                max={range[range.length - 1]}
                marks={range.reduce(sliderReducer, {})}
                value={[values[0], values[1]]}
                allowCross={false}
                step={null}
                onChange={setValuesHandler}
                onAfterChange={onAfterChange}/>
            <div className="slider-filter-values">
                <span>{values[0]}</span>
                <span>{values[1]}</span>
            </div>
        </div>
    );
};
