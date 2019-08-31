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
      oLeft: 0,
      oTop: 0
    };
  }
  static options = {
    addGlobalClass: true
  };
  static defaultProps: IAssistiveTouchProps = {};

  componentWillMount() {}

  toggle = () => {
    this.setState({
      toggled: !this.state.toggled
    });
  };

  move = e => {
    const htmlWidth = globalData.systemInfo.screenWidth;
    const htmlHeight = globalData.systemInfo.screenHeight;
    const bWidth = 50;
    const bHeight = 50;
    const currentPosition = e.detail;
    // 左侧距离
    let { oLeft, oTop } = this.state;
    if (currentPosition.x < (htmlWidth - bWidth) / 2) {
      oLeft = 0;
    } else {
      oLeft = htmlWidth - bWidth;
    }

    oTop = currentPosition.y;

    if (oTop < 0) {
      oTop = 0;
    } else if (oTop > htmlHeight - bHeight) {
      oTop = htmlHeight - bHeight;
    }

    this.setState({
      oLeft,
      oTop
    });
  };

  debounce = (fn, timer) => {
    let timer_out;

    return function(...args) {
      // 清除计时器
      if (timer_out) clearTimeout(timer_out);

      timer_out = setTimeout(() => {
        fn.apply(this, args);
      }, timer);
    };
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
    // const { oLeft, oTop } = this.state;

    return (
      <MovableArea className="move-area">
        <MovableView
          direction="all"
          className="sticky-ball"
          //onChange={this.debounce(this.move, 500)}
          onClick={this.toggle}
          // x={oLeft}
          // y={oTop}
          // style={{
          //   // left: `${oLeft}px`,
          //   // top: `${oTop}px`,
          // }}
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
