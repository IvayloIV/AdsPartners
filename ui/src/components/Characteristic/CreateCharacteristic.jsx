import React, { useState } from 'react';
import { toast } from 'react-toastify';
import TextField from '@material-ui/core/TextField';
import { Button, Icon } from 'semantic-ui-react';
import * as validations from '../../validations/ad';

export default props => {
    const [isActiveChar, setIsActiveChar] = useState(false);
    const [charName, setCharName] = useState('');
    const [charValue, setCharValue] = useState('');

    const [charNameValidation, setCharNameValidation] = useState('');
    const [charValueValidation, setCharValueValidation] = useState('');

    const onChangeHandler = (e, setValue, setValidation) => {
        const name = e.target.name;
        const value = e.target.value;

        if (setValidation !== null) {
            setValidation(validations[name](value));
        }
        setValue(value);
    };

    const onAddCharHandler = e => {
        e.preventDefault();
        if (!isActiveChar) {
            setIsActiveChar(!isActiveChar);
            return;
        }

        let haveError = false;

        haveError = validateField('charName', charName, setCharNameValidation) || haveError;
        haveError = validateField('charValue', charValue, setCharValueValidation) || haveError;

        if (haveError) {
            toast.error('Поправете грешките в допълнителните характеристики.');
            return;
        }

        props.onSubmitCharHandler(e, charName, charValue);
        setIsActiveChar(!isActiveChar);
        setCharName('');
        setCharValue('');
    };

    const validateField = (name, value, setValidation) => {
        let validationValue = validations[name](value);
        setValidation(validationValue);
        return validationValue !== '';
    };

    return (
        <div className="create-char-container">
            <div className={`new-char${isActiveChar ? '-active' : ''}`}>
                <h4>Нова характеристика</h4>
                <div className="ad-form-field" data-testid="charName-container">
                    <TextField
                        label="Име"
                        value={charName}
                        name="charName"
                        onChange={e => onChangeHandler(e, setCharName, setCharNameValidation)}
                    />
                    <span>{charNameValidation}</span>
                </div>
                <div className="ad-form-field" data-testid="charValue-container">
                    <TextField
                        label="Стойност"
                        value={charValue}
                        name="charValue"
                        onChange={e => onChangeHandler(e, setCharValue, setCharValueValidation)}
                    />
                    <span>{charValueValidation}</span>
                </div>
            </div>
            <Button color='teal' onClick={onAddCharHandler}>
                <Icon name='plus' /> {isActiveChar ? 'Добавяне' : 'Добави своя характеристика'}
            </Button>
        </div>
    );
};
