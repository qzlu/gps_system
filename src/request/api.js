/**   
 * api接口统一管理
 * Login 登录
 * 详情请看接口文档
 */
import {post } from './http';
const Login = p => post('/WebLogin', p); //登录接口
const User = (p,load=false) => post('/CarCloud_Admin', p,load); //用戶管理接口
const Common = p => post('/CarCloud_Common', p); //通用接口
export{
    Login,
    User,
    Common
}