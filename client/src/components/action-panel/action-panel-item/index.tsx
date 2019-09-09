import Taro, { Component } from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import classNames from 'classnames';

import {
  IActionPanelItemProps,
  IActionPanelItemState
} from './index.interface';
import './index.scss';

class ActionPanelItem extends Component<
  IActionPanelItemProps,
  IActionPanelItemState
> {
  constructor(props: IActionPanelItemProps) {
    super(props);
  }

  static options = {
    addGlobalClass: true
  };

  handleClick = (...args) => {
    if (typeof this.props.onClick === 'function') {
      this.props.onClick(...args);
    }
  };
  render() {
    const rootClass = classNames('fx-action-panel__item', this.props.className);
    const iconClass = classNames(
      'fx-action-panel__item-icon',
      'iconfont',
      this.props.icon
    );
    return (
      <View className={rootClass}>
        <View className={iconClass} onClick={this.handleClick}>
          {this.props.children}
        </View>
        <Text className="fx-action-panel__item-text">{this.props.title}</Text>
      </View>
    );
  }
}
export default ActionPanelItem;
