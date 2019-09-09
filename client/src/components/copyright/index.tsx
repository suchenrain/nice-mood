import Taro, { Component } from '@tarojs/taro';
import { View } from '@tarojs/components';

import { ICopyrightProps, ICopyrightState } from './index.interface';
import './index.scss';

class Copyright extends Component<ICopyrightProps, ICopyrightState> {
  constructor(props: ICopyrightProps) {
    super(props);
    this.state = {};
  }
  static options = {
    addGlobalClass: true
  };
  static defaultProps: ICopyrightProps = {};
  render() {
    return (
      <View className="fx-copyright">
        <View className="fx-copyright__link">github @suchenrain</View>
        <View className="fx-copyright__text">Copyright © 2019 suchenrain</View>
      </View>
    );
  }
}
export default Copyright;
