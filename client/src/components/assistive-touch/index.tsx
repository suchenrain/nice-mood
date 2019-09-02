import Taro, { Component } from '@tarojs/taro';
import { View } from '@tarojs/components';

import { IAssistiveTouchProps, IAssistiveTouchState } from './index.interface';
import classNames from 'classnames';
import './index.scss';
import { PAGES } from '@/config/weappConfig';

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

  componentWillMount() {}

  toggle = e => {
    e.stopPropagation();
    e.preventDefault();
    this.setState({
      toggled: !this.state.toggled
    });
  };

  navigate = page => e => {
    e.stopPropagation();
    e.preventDefault();
    let url: string = PAGES.INDEX;
    switch (page) {
      case 'about':
        url = PAGES.ABOUT;
        break;
      case 'setting':
        url = PAGES.SETTING;
        break;
      case 'profile':
        url = PAGES.PROFILE;
        break;
      default:
        break;
    }
    Taro.navigateTo({ url });
  };

  render() {
    const { toggled } = this.state;
    const stickyBallClass = classNames('iconfont', {
      'icon-circle': toggled,
      'icon-cha': !toggled
    });
    const togClass = classNames({
      display: toggled
    });
    const iconClass = classNames({
      view: toggled
    });

    return (
      <View className="sticky-ball" onClick={this.toggle}>
        <View className={stickyBallClass} />
        <View className={`tog ball1 ${togClass}`}>
          <View
            className={`iconfont icon-setting ${iconClass}`}
            onClick={this.navigate('setting')}
          />
        </View>
        <View className={`tog ball2 ${togClass}`}>
          <View
            className={`iconfont icon-favorite ${iconClass}`}
            onClick={this.navigate('profile')}
          />
        </View>
        <View className={`tog ball3 ${togClass}`}>
          <View
            className={`iconfont icon-info ${iconClass}`}
            onClick={this.navigate('about')}
          />
        </View>
      </View>
    );
  }
}
export default AssistiveTouch;
