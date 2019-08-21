import Taro, { Component } from '@tarojs/taro';
import { View } from '@tarojs/components';
import classNames from 'classnames';

import { IActionPanelProps, IActionPanelState } from './index.interface';
import './index.scss';

class ActionPanel extends Component<IActionPanelProps, IActionPanelState> {
  constructor(props: IActionPanelProps) {
    super(props);
    const { isOpened } = props;
    this.state = {
      _isOpened: isOpened
    };
  }

  static defaultProps: IActionPanelProps = {
    isOpened: false,
    cancelText: '取消'
  };

  componentWillReceiveProps(nextProps: IActionPanelProps) {
    const { isOpened } = nextProps;
    if (isOpened !== this.state._isOpened) {
      this.setState({
        _isOpened: isOpened
      });
    }
  }
  handleClose = () => {
    if (typeof this.props.onClose === 'function') {
      this.props.onClose();
    }
  };
  handleCancel = () => {
    if (typeof this.props.onCancel === 'function') {
      return this.props.onCancel();
    }
    this.close();
  };

  close = () => {
    this.setState(
      {
        _isOpened: false
      },
      this.handleClose
    );
  };

  handleTouchMove = e => {
    e.stopPropagation();
    e.preventDefault();
  };

  render() {
    const { cancelText, className } = this.props;
    const { _isOpened } = this.state;

    const rootClass = classNames(
      'fx-action-panel',
      {
        'fx-action-panel--active': _isOpened
      },
      className
    );

    return (
      <View className={rootClass} onTouchMove={this.handleTouchMove}>
        <View onClick={this.close} className="fx-action-panel__overlay" />
        <View className="fx-action-panel__container">
          <View className="fx-action-panel__body">{this.props.children}</View>
          {cancelText && (
            <View
              className="fx-action-panel__footer"
              onClick={this.handleCancel}
            >
              {cancelText}
            </View>
          )}
        </View>
      </View>
    );
  }
}
export default ActionPanel;
