import { LOGIN_ADMIN_SUCCESS } from '../actions/actionTypes';

export function companyReducer(state = { loginSuccess: false }, action) {
    switch (action.type) {
        case LOGIN_ADMIN_SUCCESS:
            return Object.assign({}, state, { loginSuccess: true });
        default:
            return state;
    }
}