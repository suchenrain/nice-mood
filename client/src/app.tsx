import '@tarojs/async-await';
import Taro, { Component, Config } from '@tarojs/taro';
import { Provider } from '@tarojs/redux';

import models from '@/models';
import dva from '@/utils/dva';
import { globalData } from '@/utils/common';

import '@/config/taroConfig';
import '@/config/httpRequestConfig';

import './app.scss';
import Home from './pages/home/home';
import { defaultSetting } from './types';

// 如果需要在 h5 环境中开启 React Devtools
// 取消以下注释：
// if (process.env.NODE_ENV !== 'production' && process.env.TARO_ENV === 'h5')  {
//   require('nerv-devtools')
// }

const dvaApp = dva.createApp({
  initialState: {},
  models: models
});

const store = dvaApp.getStore();

class App extends Component {
  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */

  config: Config = {
    pages: [
      'pages/home/home',
      'pages/about/about',
      'pages/profile/profile',
      'pages/setting/setting',
      'pages/systeminfo/systeminfo'
    ],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#33333300',
      navigationBarTitleText: 'WeChat',
      navigationBarTextStyle: 'white',
      navigationStyle: 'custom'
    },
    permission: {
      'scope.userLocation': {
        desc: '你的位置信息将用于获取天气信息'
      }
    }
  };

  /**
   *
   *  1.小程序打开的参数 globalData.extraData.xx
   *  2.从二维码进入的参数 globalData.extraData.xx
   *  3.获取小程序的设备信息 globalData.systemInfo
   */
  async componentDidMount() {
    // 初始化云开发
    if (process.env.TARO_ENV === 'weapp') {
      Taro.cloud.init({
        env: 'YOUR CLOUD ENV ID',
        traceUser: true
      });
    }
    // 获取参数
    const refererInfo = this.$router.params.refererInfo;
    const query = this.$router.params.query;
    !globalData.extraData && (globalData.extraData = {});
    if (refererInfo && refererInfo.extraData) {
      globalData.extraData = refererInfo.extraData;
    }
    if (query) {
      globalData.extraData = {
        ...globalData.extraData,
        ...query
      };
    }
    // 获取设备信息
    const sys = await Taro.getSystemInfo();
    sys && (globalData.systemInfo = sys);

    // 获取用户设置
    try {
      const setting = Taro.getStorageSync('setting');
      if (setting) {
        globalData.setting = setting;
      } else {
        globalData.setting = defaultSetting;
      }
    } catch (err) {}
  }

  componentDidShow() {}

  componentDidHide() {}

  componentDidCatchError() {}

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render() {
    return (
      <Provider store={store}>
        <Home />
      </Provider>
    );
  }
}

Taro.render(<App />, document.getElementById('app'));
