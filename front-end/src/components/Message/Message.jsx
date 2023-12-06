import { message } from "antd";

const success = (mes = 'Susscess') => {
    message.success(mes);
};

const error = (mes = 'Error')=>
{
    message.error(mes);
};

const warning = (mes = 'Warning') =>{
    message.warning('This is a warning message');
};
export {success,error,warning }