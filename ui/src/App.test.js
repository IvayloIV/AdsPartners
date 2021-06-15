import React from 'react';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import { render, screen, fireEvent } from '@testing-library/react';
import reducers from './reducers/reducers';
import LoginCompany from './components/Company/LoginCompanyPage';
import CreateAd from './components/Ad/CreateAd';

const store = createStore(
  combineReducers(reducers),
  applyMiddleware(thunk)
);

test('Login email validation', () => {
  render(
    <Provider store={store}>
        <LoginCompany />
    </Provider>);

  const emailInput = screen.getByRole('textbox');
  const emailValidation = screen.getByTestId("emailValidation");

  expect(emailValidation.textContent).toBe('');
  fireEvent.change(emailInput, { target: { value: "test" } });
  expect(emailValidation.textContent).toBe('Мейлът трябва да е между 4 и 257 символа.');
});

test('Test ad characteristic', () => {
  render(
    <Provider store={store}>
        <CreateAd />
    </Provider>);

  const characteristicButton = screen.getByText('Добави своя характеристика');
  fireEvent.click(characteristicButton);
  expect(characteristicButton.textContent.trim()).toBe('Добавяне');

  const charNameInput = screen.getByTestId("charName-container").getElementsByTagName('input')[0];
  const charValueInput = screen.getByTestId("charValue-container").getElementsByTagName('input')[0];

  fireEvent.change(charNameInput, { target: { value: "Цвят" } });
  fireEvent.change(charValueInput, { target: { value: "Зелен, Жълт, Червен" } });

  fireEvent.click(characteristicButton);
  expect(characteristicButton.textContent.trim()).toBe('Добави своя характеристика');
  expect(screen.queryByText("Цвят - Зелен, Жълт, Червен")).not.toBeNull();
});
