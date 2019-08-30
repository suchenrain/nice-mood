import Taro, { Component } from '@tarojs/taro';
import { View } from '@tarojs/components';

import { IAssistiveTouchProps, IAssistiveTouchState } from './index.interface';
import classNames from 'classnames';
import './index.scss';

class AssistiveTouch extends Component<
  IAssistiveTouchProps,
  IAssistiveTouchState
> {
  constructor(props: IAssistiveTouchProps) {
    super(props);
    this.state = {
      toggled: true
    };
  }
  static options = {
    addGlobalClass: true
  };
  static defaultProps: IAssistiveTouchProps = {};

  toggle = () => {
    this.setState({
      toggled: !this.state.toggled
    });
  };

  render() {
    const { toggled } = this.state;
    const stickyBallClass = classNames('iconfont', 'o', {
      'icon-cha': toggled,
      'icon-refresh': !toggled
    });
    const togClass = classNames({
      display: toggled
    });
    const iconClass = classNames({
      view: toggled
    });

    return (
      <View className="fx-assistive-touch">
        <View className="sticky-ball" onClick={this.toggle}>
          <View className={stickyBallClass}></View>
          <View className={`tog ball1 ${togClass}`}>
            <View className={`iconfont icon-cha ${iconClass}`}></View>
          </View>
          <View className={`tog ball2 ${togClass}`}>
            <View className={`iconfont icon-cha ${iconClass}`}></View>
          </View>
          <View className={`tog ball3 ${togClass}`}>
            <View className={`iconfont icon-cha ${iconClass}`}></View>
          </View>
        </View>
      </View>
    );
  }
}
export default AssistiveTouch;
