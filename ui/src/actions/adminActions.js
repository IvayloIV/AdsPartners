import { toast } from 'react-toastify';
import { LOGIN_ADMIN_SUCCESS } from '../actions/actionTypes';
import { loginAdmin } from '../services/adminServices';

function loginAdminAction(email, password) {
    return (dispatch) => {
        return loginAdmin(email, password)
            .then(json => {
                //TODO: check if register is success and json contains success object
                console.log(json);
                localStorage.setItem('accessToken', json.accessToken);
                localStorage.setItem('username', json.username); //TODO: get name and other things
                localStorage.setItem('roles', JSON.stringify(json.roles));
                dispatch({ type: LOGIN_ADMIN_SUCCESS });
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

export { loginAdminAction, logoutAction };