import Taro, { Component } from '@tarojs/taro';
import { Button } from '@tarojs/components';

import { IOpenSettingProps, IOpenSettingState } from './index.interface';
import './index.scss';
import { AtModal, AtModalContent, AtModalAction } from 'taro-ui';

class OpenSetting extends Component<IOpenSettingProps, IOpenSettingState> {
  constructor(props: IOpenSettingProps) {
    super(props);
  }


  render() {
    const { onCancel, onOk, isOpened } = this.props;
    return (
      <AtModal isOpened={isOpened}>
        <AtModalContent>
          检测到您已关闭地理位置授权，建议开启以提升体验哦！
        </AtModalContent>
        <AtModalAction>
          {' '}
          <Button onClick={onCancel}>忽略</Button>{' '}
          <Button onClick={onOk} openType="openSetting">
            去开启
          </Button>{' '}
        </AtModalAction>
      </AtModal>
    );
  }
}
export default OpenSetting;
