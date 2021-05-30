import React from 'react';
import { Icon } from 'semantic-ui-react';

export default props => {
    return (
        <div>
            <ul>
                {props.characteristics.map((c, i) =>
                    <li key={i}>
                        <span>{c.name + " - " + c.value}</span>
                        <span className="remove-char" onClick={e => props.onClickRemoveChar(e, i)}>
                            <Icon name="remove" />
                        </span>
                    </li>
                )}
            </ul>
        </div>
    );
};
