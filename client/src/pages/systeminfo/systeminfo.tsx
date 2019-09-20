import Taro, { Component, Config } from '@tarojs/taro';
import { View } from '@tarojs/components';
import { ISysteminfoProps, ISysteminfoState } from './systeminfo.interface';

import './systeminfo.scss';
import { getGlobalData } from '@/utils/common';

import classNames from 'classnames';

const infos = [
  {
    key: 'brand',
    title: '手机品牌'
  },
  {
    key: 'model',
    title: '手机型号'
  },
  {
    key: 'pixelRatio',
    title: '设备像素比'
  },
  {
    key: 'screenWidth',
    title: '屏幕宽度'
  },
  {
    key: 'screenHeight',
    title: '屏幕高度'
  },
  {
    key: 'windowWidth',
    title: '可使用窗口宽度'
  },
  {
    key: 'windowHeight',
    title: '可使用窗口高度'
  },
  {
    key: 'statusBarHeight',
    title: '状态栏高度'
  },
  {
    key: 'language',
    title: '微信设置的语言'
  },
  {
    key: 'version',
    title: '微信版本号'
  },
  {
    key: 'system',
    title: '操作系统'
  },
  {
    key: 'platform',
    title: '客户端平台'
  },
  {
    key: 'fontSizeSetting',
    title: '用户字体大小设置(px)'
  },
  {
    key: 'SDKVersion',
    title: '客户端基础库版本'
  }
];

class Systeminfo extends Component<ISysteminfoProps, ISysteminfoState> {
    config: Config = {
        navigationBarTitleText: '系统信息',
        navigationBarBackgroundColor: '#40a7e7',
        navigationBarTextStyle: 'white',
        navigationStyle: 'default'
      };
  constructor(props: ISysteminfoProps) {
    super(props);
    this.state = {
      systeminfo: {},
      infoProps: infos
    };
  }
  componentDidMount() {
    const systeminfo = getGlobalData('systemInfo');
    this.setState({
      systeminfo
    });
  }
  render() {
    const { platform } = this.state.systeminfo;
    const brandClass = classNames('fx-systeminfo-brand', 'iconfont', {
      'icon-ios': platform == 'ios',
      'icon-android': platform == 'android'
    });

    const { systeminfo, infoProps } = this.state;
    const items = infoProps.map((item, index) => {
      return (
        <View key={index} className="fx-systeminfo-item">
          <View className="fx-systeminfo-item-title">{item.title}</View>
          <View className="fx-systeminfo-item-value">
            {systeminfo[item.key]}
          </View>
        </View>
      );
    });

    return (
      <View className="fx-systeminfo">
        <View className={brandClass}></View>
        {items}
      </View>
    );
  }
}
export default Systeminfo;
