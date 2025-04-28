import { IUserInfo } from '@/types';
import request from './index';


/**
 * 1、这里不做 ahooks封装，为了保持接口调用的灵活性,在具体请求时封装。
 * 2、ahooks包含了防抖、节流、loading、缓存、请求重试、请求取消等功能... https://ahooks.js.org/zh-CN/hooks/use-request/index
 * 3、本文件主要写公共请求，具体请求，请在具体页面中封装。
 */

/**
 * 获取用户信息
 * @returns 
 */
export const getUserInfo = () => {
  return request.get<unknown, IUserInfo>('/api/user/info');
};