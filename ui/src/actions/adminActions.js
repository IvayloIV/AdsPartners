import { toast } from 'react-toastify';
import { loginAdmin } from '../services/adminService';
import { setJWTCookies } from '../utils/CookiesUtil';
import { handleException } from './commonActions';

export const loginAdminAction = params => {
    return handleException(async () => {
        const json = await loginAdmin(params);
        setJWTCookies(json.token);

        toast.success(`Успешно влязохте като администратор в системата.`);
        return json;
    });
};
