import Taro, { Component, Config } from '@tarojs/taro';
import { View, Switch } from '@tarojs/components';

// import Tips from '@/utils/tips'
// import {  } from '@/components'
import { ISettingProps, ISettingState } from './setting.interface';

import './setting.scss';
import { PAGES } from '@/config/weappConfig';
import { defaultSetting } from '@/types';
import { setGlobalData, getGlobalData } from '@/utils/common';

class Setting extends Component<ISettingProps, ISettingState> {
  config: Config = {
    navigationBarTitleText: '设置',
    navigationBarBackgroundColor: '#40a7e7',
    navigationBarTextStyle: 'white',
    navigationStyle: 'default'
  };
  constructor(props: ISettingProps) {
    super(props);
    this.state = {
      setting: defaultSetting
    };
  }
  componentWillMount() {
    this.syncSetting();
  }

  syncSetting = () => {
    const setting = getGlobalData('setting');
    this.setState({ setting });
  };

  systemInfo = () => {
    Taro.navigateTo({
      url: PAGES.SYSTEMINFO
    });
  };

  handleSwithChange = key => e => {
    let { setting } = this.state;
    setting[key] = e.detail.value;
    Taro.setStorage({
      key: 'setting',
      data: setting
    }).then(() => {
      this.setState({ setting }, () => {
        setGlobalData('setting', { ...setting });
      });
    });
  };

  reset = () => {
    Taro.showModal({
      title: '提示',
      content: '确认要初始化设置',
      cancelText: '容朕想想',
      confirmColor: '#40a7e7',
      success: res => {
        if (res.confirm) {
          Taro.removeStorage({
            key: 'setting'
          }).then(res => {
            this.setState({ setting: defaultSetting }, () => {
              setGlobalData('setting', { ...defaultSetting });
            });
            Taro.showToast({
              title: '设置已初始化'
            });
          });
        }
      }
    });
  };

  clear = () => {
    Taro.showModal({
      title: '提示',
      content: '确认要删除',
      cancelText: '再想想',
      confirmColor: '#40a7e7',
      success: res => {
        if (res.confirm) {
          Taro.clearStorage({
            success: res => {
              this.setState({ setting: defaultSetting }, () => {
                setGlobalData('setting', { ...defaultSetting });
              });
              Taro.showToast({
                title: '数据已清除'
              });
            }
          });
        }
      }
    });
  };

  render() {
    const { setting } = this.state;
    return (
      <View className="fx-setting">
        <View className="panel">
          <View className="panel-title">自定义</View>
          <View className="panel-content">
            <View className="panel-item">
              <View>显示头像及问候语</View>
              <Switch
                color="#40a7e7"
                checked={setting.enableGreeting}
                onChange={this.handleSwithChange('enableGreeting')}
              />
            </View>
            <View className="panel-item">
              <View>固定悬浮按钮(右下角)</View>
              <Switch
                checked={true}
                disabled={true}
                color="#40a7e7"
                onChange={this.handleSwithChange('touchBallFixed')}
              />
            </View>
          </View>
        </View>
        <View className="panel">
          <View className="panel-title">检查更新</View>
          <View className="panel-content">
            <View className="panel-item">
              <View>
                <View>小程序更新提醒</View>
                <View className="panel-item-tip-icon iconfont icon-help">
                  <View className="panel-item-tip-text">
                    首页启动时若检测到新版本，提示更新
                  </View>
                </View>
              </View>
              <Switch
                color="#40a7e7"
                checked={setting.enableUpdateCheck}
                onChange={this.handleSwithChange('enableUpdateCheck')}
              />
            </View>
          </View>
        </View>
        <View className="panel">
          <View className="panel-title">工具</View>
          <View className="panel-content">
            <View className="panel-subtitle">系统信息</View>
            <View
              className="panel-item panel-item-sub"
              onClick={this.systemInfo}
            >
              <View>查看当前系统信息</View>
              <View className="right iconfont icon-right"></View>
            </View>
          </View>
        </View>
        <View className="panel">
          <View className="panel-title">清除数据</View>
          <View className="panel-content">
            <View className="panel-item" onClick={this.reset}>
              <View>
                <View>恢复初始化设置</View>
                <View className="panel-item-tip-icon iconfont icon-warning">
                  <View className="panel-item-tip-text">
                    所有设置将恢复初始值
                  </View>
                </View>
              </View>
              <View className="right iconfont icon-right"></View>
            </View>
            <View className="panel-item" onClick={this.clear}>
              <View>
                <View>清除本地所有数据</View>
                <View className="panel-item-tip-icon iconfont icon-warning">
                  <View className="panel-item-tip-text">
                    所有本地缓存数据将被清除
                  </View>
                </View>
              </View>
              <View className="right iconfont icon-right"></View>
            </View>
          </View>
        </View>
      </View>
    );
  }
}
export default Setting;
