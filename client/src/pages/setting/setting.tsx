import Taro, { Component, Config } from '@tarojs/taro';
import { View, Switch } from '@tarojs/components';

// import Tips from '@/utils/tips'
// import {  } from '@/components'
import { ISettingProps, ISettingState } from './setting.interface';

import './setting.scss';
class Setting extends Component<ISettingProps, ISettingState> {
  config: Config = {
    navigationBarTitleText: '设置',
    navigationBarBackgroundColor: '#40a7e7',
    navigationBarTextStyle: 'white',
    navigationStyle: 'default'
  };
  constructor(props: ISettingProps) {
    super(props);
    this.state = {};
  }
  componentDidMount() {}
  render() {
    return (
      <View className="fx-setting">
        <View className="panel">
          <View className="panel-title">自定义</View>
          <View className="panel-content">
            <View className="panel-item">
              <View>显示头像及问候语</View>
              <Switch />
            </View>
            <View className="panel-item">
              <View>固定悬浮按钮（右下角）</View>
              <Switch />
            </View>
          </View>
        </View>
        <View className="panel">
          <View className="panel-title">检查更新</View>
          <View className="panel-content">
            <View className="panel-item">
              <View className="">
                <View>小程序更新提醒</View>
                <View className="panel-item-tip-icon iconfont icon-info">
                  <View className="panel-item-tip-text">
                    首页启动时若检测到新版本，提示更新
                  </View>
                </View>
              </View>
              <Switch />
            </View>
          </View>
        </View>
      </View>
    );
  }
}
export default Setting;
