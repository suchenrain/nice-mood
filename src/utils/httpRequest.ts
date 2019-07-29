import { commonParame } from '../config/httpRequestConfig';
import { MAINHOST } from '../config';
import Taro from '@tarojs/taro';

declare type Methods =
  | 'GET'
  | 'OPTIONS'
  | 'HEAD'
  | 'PUT'
  | 'DELETE'
  | 'TRACE'
  | 'CONNECT';

declare type HttpHeaders = { [key: string]: string };
declare type Datas = {
  method: Methods;
  [key: string]: any;
};

interface IOptions {
  url: string;
  host?: string;
  method?: Methods;
  data?: Datas;
  header?: HttpHeaders;
}

export class Request {
  // 登陆promise
  static loginReadyPromise: Promise<any> = Promise.resolve();
  // 登陆状态
  static isLoading: boolean = false;

  /**
   * API词典对象
   */
  static apiList: { [key: string]: () => any } = {};

  /**
   * token
   */
  static token: string = '';

  /**
   * 合并处理options
   * @param opts
   * @param data
   * @param method
   */
  static combineOptions(
    opts: IOptions | string,
    data: Datas,
    method: Methods
  ): IOptions {
    typeof opts === 'string' && (opts = { url: opts });
    return {
      url: `${opts.host || MAINHOST}${opts.url}`,
      method: opts.method || data.method || method || 'GET',
      data: { ...commonParame, ...opts.data, ...data }
    };
  }

  /**
   * 获取本地token
   */
  static getToken() {
    !this.token && (this.token = Taro.getStorageSync('token'));
    return this.token;
  }
}
