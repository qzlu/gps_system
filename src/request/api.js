/**   
 * api接口统一管理
 * Login 登录
 * 详情请看接口文档
 */
import {post } from './http';
const Login = p => post('checklogin', p); //登录接口
export{
    Login
}