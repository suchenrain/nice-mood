import Taro, { Component } from '@tarojs/taro';
import { View, MovableArea, MovableView } from '@tarojs/components';

import { IAssistiveTouchProps, IAssistiveTouchState } from './index.interface';
import classNames from 'classnames';
import './index.scss';
import { globalData } from '../../utils/common';

class AssistiveTouch extends Component<
  IAssistiveTouchProps,
  IAssistiveTouchState
> {
  constructor(props: IAssistiveTouchProps) {
    super(props);
    this.state = {
      toggled: true,
      oLeft: '80%',
      oTop: '80%'
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

  move = e => {
    const htmlWidth = globalData.systemInfo.screenWidth;
    const htmlHeight = globalData.systemInfo.screenHeight;
    console.log(e);
    // let oLeft = e.clientX - this.oW;
    // let oTop = e.clientY - this.oH;
    // if (oLeft < 0) {
    //   oLeft = 0;
    // } else if (oLeft > htmlWidth - this.bWidth) {
    //   oLeft = htmlWidth - this.bWidth;
    // }
    // if (oTop < 0) {
    //   oTop = 0;
    // } else if (oTop > htmlHeight - this.bHeight) {
    //   oTop = htmlHeight - this.bHeight;
    // }
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
      <MovableArea className="move-area">
        <MovableView
          direction="all"
          className="sticky-ball"
          onChange={this.move}
          onClick={this.toggle}
          style={{
            left: `${this.state.oLeft}`,
            top: `${this.state.oTop}`
          }}
        >
          <View className={stickyBallClass} />
          <View className={`tog ball1 ${togClass}`}>
            <View className={`iconfont icon-cha ${iconClass}`} />
          </View>
          <View className={`tog ball2 ${togClass}`}>
            <View className={`iconfont icon-cha ${iconClass}`} />
          </View>
          <View className={`tog ball3 ${togClass}`}>
            <View className={`iconfont icon-cha ${iconClass}`} />
          </View>
        </MovableView>
      </MovableArea>
    );
  }
}
export default AssistiveTouch;
