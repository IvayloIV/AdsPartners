import { toast } from 'react-toastify';
import { REGISTER_COMPANY_SUCCESS, LOGIN_COMPANY_SUCCESS } from '../actions/actionTypes';
import { registerCompany, loginCompany } from '../services/companyService';

function registerCompanyAction(email, password, name, workersCount, logo) {
    return (dispatch) => {
        return registerCompany(email, password, name, workersCount, logo)
            .then(json => {
                console.log(json); //TODO: check if register is success and json contains success object
                dispatch({ type: REGISTER_COMPANY_SUCCESS });

                return json;
            });
    };
}

function loginCompanyAction(email, password) {
    return (dispatch) => {
        return loginCompany(email, password)
            .then(json => {
                //TODO: check if register is success and json contains success object
                console.log(json);
                localStorage.setItem('accessToken', json.accessToken);
                localStorage.setItem('username', json.username); //TODO: get name and other things
                localStorage.setItem('roles', JSON.stringify(json.roles));
                dispatch({ type: LOGIN_COMPANY_SUCCESS });
                let msg = null;
                toast.success(`${msg || 'Login'} successful.`);
            });
    };
}

function logoutAction() {
    return (dispatch) => {
        localStorage.clear();
    };
}

export { registerCompanyAction, loginCompanyAction, logoutAction };