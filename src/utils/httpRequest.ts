import Taro, { Component } from '@tarojs/taro';

import { commonParame, httpRequestConfig } from '@/config/httpRequestConfig';
import { MAINHOST, ISMOCK } from '@/config/index';
import Tips from './tips';

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

  /**
   * 微信登录
   */
  static login() {
    if (!this.isLoading) {
      this.loginReadyPromise = this.onLogining();
    }
    return this.loginReadyPromise;
  }

  static onLogining(): Promise<any> {
    this.isLoading = true;
    return new Promise(async (resolve, reject) => {
      // code
      const { code } = await Taro.login();
      const { data } = await Taro.request({
        url: `${MAINHOST}${httpRequestConfig.loginUrl}`,
        data: { code: code }
      });
      if (data.code !== 0 || !data.data || !data.data.token) {
        reject();
        return;
      }
    });
  }
  /**
   * 封装Taro的 request请求
   * @param opts
   */
  static async request(opts: IOptions) {
    const res = await Taro.request(opts);

    // 是否mock
    //if (ISMOCK) return res.data;

    //请求失败
    if (res.data.code === 99999) {
      await this.login();
      return this.request(opts);
    }

    //请求成功
    if (res.data) {
      return res.data;
    }

    const edata = {
      ...res.data,
      err: (res.data && res.data.msg) || '网络错误'
    };
    Tips.toast(edata.err);
    throw new Error(edata.err);
  }

  /**
   * 创建请求函数
   * @param opts
   */
  static createRequests(opts: IOptions | string): () => {} {
    console.log('opts==>', opts);
    return async (data = {}, method: Methods = 'GET') => {
      const _opts = this.combineOptions(opts, data, method);
      const res = await this.request(_opts);
      return res;
    };
  }

  /**
   * Api方法列表
   * @param requestConfig
   */
  static getApiList(requestConfig) {
    if (!Object.keys(requestConfig).length) {
      return {};
    }
    Object.keys(requestConfig).forEach(key => {
      this.apiList[key] = this.createRequests(requestConfig[key]);
    });
    return this.apiList;
  }
}

const Api = Request.getApiList(httpRequestConfig);
Component.prototype.$api = Api;
export default Api as any;
