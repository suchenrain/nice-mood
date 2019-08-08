import Taro, { Component } from '@tarojs/taro';
import { View, Text } from '@tarojs/components';

import { IOpenSettingProps, IOpenSettingState } from './index.interface';
import './index.scss';
import { AtButton } from 'taro-ui';

class OpenSetting extends Component<IOpenSettingProps, IOpenSettingState> {
  constructor(props: IOpenSettingProps) {
    super(props);
  }
  static options = {
    addGlobalClass: true
  };

  render() {
    const { onCancel, onOk } = this.props;
    return (
      <View className="fx-open-setting-wrap">
        <View className="at-row">
          <Text>检测到您已关闭地理位置授权，建议开启以提升体验哦！</Text>
        </View>
        <View className="at-row at-row__justify--around ">
          <View className="at-col at-col-5">
            <AtButton type="secondary" onClick={onCancel}>
              忽略
            </AtButton>
          </View>
          <View className="at-col at-col-5">
            <AtButton type="primary" openType="openSetting" onClick={onOk}>
              去设置
            </AtButton>
          </View>
        </View>
      </View>
    );
  }
}
export default OpenSetting;
