import { toast } from 'react-toastify';
import { loginAdmin } from '../services/adminServices';
import { setCookie } from '../utils/CookiesUtil';
import { handleException } from './commonActions';

export const loginAdminAction = params => {
    return handleException(async () => {
        const json = await loginAdmin(params);
        setCookie('accessToken', json.accessToken, 1);
        setCookie('username', json.username, 1);
        setCookie('roles', JSON.stringify(json.roles), 1);

        toast.success(`Успешно влязохте като администратор в системата.`);
        return json;
    });
};
