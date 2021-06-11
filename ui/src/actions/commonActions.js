import { toast } from 'react-toastify';
import { deleteAllCookies } from '../utils/CookiesUtil';

export const handleException = func => {
    return async (dispatch) => {
        try {
            return await func(dispatch);
        } catch (err) {
            err.messages.forEach(e => toast.error(e));
            return null;
        }
    };
};

export const logoutAction = () => {
    return () => {
        deleteAllCookies();
    };
};