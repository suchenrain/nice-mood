import Taro, { Component } from '@tarojs/taro';
import { View } from '@tarojs/components';

import { IOpenSettingProps, IOpenSettingState } from './index.interface';
import './index.scss';
import { AtButton } from 'taro-ui';

class OpenSetting extends Component<IOpenSettingProps, IOpenSettingState> {
  constructor(props: IOpenSettingProps) {
    super(props);
  }
  
  render() {
    const { onCancel, onOk } = this.props;
    return (
      <View className="fx-open-setting-wrap">
        <View className="at-curtain__container">
          <View className="at-row at-row__justify--center">
            检测到您已关闭地理位置授权，建议开启以提升体验哦！
          </View>
          <View className="at-row at-row__justify--center">
            <View className="at-col at-col-3">
              <AtButton type="secondary" onClick={onCancel}>
                忽略
              </AtButton>
            </View>
            <View className="at-col at-col-3">
              <AtButton
                type="primary"
                openType="openSetting"
                onOpenSetting={onOk}
              >
                去设置
              </AtButton>
            </View>
          </View>
        </View>
      </View>
    );
  }
}
export default OpenSetting;
