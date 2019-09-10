import Taro, { Component } from '@tarojs/taro';
import { View, Text, Input } from '@tarojs/components';

import { ISearchBarProps, ISearchBarState } from './index.interface';
import classNames from 'classnames';
import './index.scss';

class SearchBar extends Component<ISearchBarProps, ISearchBarState> {
  constructor(props: ISearchBarProps) {
    super(props);
    this.state = {
      isFocus: false
    };
  }
  static options = {
    addGlobalClass: true
  };
  static defaultProps: ISearchBarProps = {
    value: '',
    placeholder: '输入城市或地区',
    maxLength: 140,
    fixed: false,
    focus: false,
    disabled: false,
    showActionButton: false,
    actionName: '搜一下',
    className: '',
    customStyle: {},
    onChange: () => {},
    onFocus: () => {},
    onBlur: () => {},
    onConfirm: () => {},
    onActionClick: () => {}
  };

  handleFocus = () => {
    this.setState({
      isFocus: true
    });
    this.props.onFocus();
  };

  handleBlur = () => {
    this.setState({
      isFocus: false
    });
    this.props.onBlur();
  };

  handleChange = e => this.props.onChange(e.target.value);

  handleClear = () => {
    if (this.props.onClear) {
      this.props.onClear();
    } else {
      this.props.onChange('');
    }
  };

  handleConfirm = () => this.props.onConfirm();

  handleActionClick = () => this.props.onActionClick();

  render() {
    const {
      value,
      placeholder,
      maxLength,
      fixed,
      focus,
      disabled,
      showActionButton,
      actionName,
      className,
      customStyle
    } = this.props;
    const { isFocus } = this.state;
    const fontSize = 14;
    const rootCls = classNames(
      'fx-search-bar',
      {
        'fx-search-bar--fixed': fixed
      },
      className
    );
    const placeholderWrapStyle: any = {};
    const actionStyle: any = {};
    if (isFocus || (!isFocus && value)) {
      actionStyle.opacity = 1;
      actionStyle.marginRight = `0`;
      placeholderWrapStyle.flexGrow = 0;
    } else if (!isFocus && !value) {
      placeholderWrapStyle.flexGrow = 1;
      actionStyle.opacity = 0;
      actionStyle.marginRight = `-${(actionName.length + 1) * fontSize +
        fontSize / 2}px`;
    }
    if (showActionButton) {
      actionStyle.opacity = 1;
      actionStyle.marginRight = `0`;
    }

    const clearIconStyle = { display: 'flex' };
    const placeholderStyle: any = { visibility: 'hidden' };
    if (!value.length) {
      clearIconStyle.display = 'none';
      placeholderStyle.visibility = 'visible';
    }

    return (
      <View className={rootCls} style={customStyle}>
        <View className="fx-search-bar__input-cnt">
          <View
            className="fx-search-bar__placeholder-wrap"
            style={placeholderWrapStyle}
          >
            <Text className="iconfont icon-search"></Text>
            <Text
              className="fx-search-bar__placeholder"
              style={placeholderStyle}
            >
              {isFocus ? '' : placeholder}
            </Text>
          </View>
          <Input
            className="fx-search-bar__input"
            type="text"
            confirmType="search"
            value={value}
            focus={focus}
            disabled={disabled}
            maxLength={maxLength}
            onInput={this.handleChange}
            onFocus={this.handleFocus}
            onBlur={this.handleBlur}
            onConfirm={this.handleConfirm}
          />
          <View
            className="fx-search-bar__clear"
            style={clearIconStyle}
            onTouchStart={this.handleClear}
          >
            <Text className="iconfont icon-clear_circle_outlined"></Text>
          </View>
        </View>
        <View
          className="fx-search-bar__action"
          style={actionStyle}
          onClick={this.handleActionClick}
        >
          {actionName}
        </View>
      </View>
    );
  }
}

export default SearchBar;
