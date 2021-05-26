import { toast } from 'react-toastify';
import { loginAdmin } from '../services/adminServices';
import { setCookie, deleteAllCookies } from '../utils/CookiesUtil';

export const loginAdminAction = (params) => {
    return async () => {
        try {
            const json = await loginAdmin(params);
            setCookie('accessToken', json.accessToken, 1);
            setCookie('username', json.username, 1);
            setCookie('roles', JSON.stringify(json.roles), 1);

            toast.success(`Успешно влязохте като администратор в системата.`);
            return json;
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
