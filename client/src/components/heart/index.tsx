import Taro, { Component } from '@tarojs/taro';
import { Text, View } from '@tarojs/components';
import classNames from 'classnames';
import { IHeartProps, IHeartState } from './index.interface';
import './index.scss';

class Heart extends Component<IHeartProps, IHeartState> {
  constructor(props: IHeartProps) {
    super(props);
    const { active } = props;
    this.state = {
      _active: active
    };
  }
  static options = {
    addGlobalClass: true
  };

  // static defaultProps: IHeartProps = {
  //   active: false
  // };

  componentWillReceiveProps(nextProps: IHeartProps) {
    const { active } = nextProps;
    this.setState({
      _active: active
    });
  }

  handleClick = () => {
    const { _active } = this.state;
    if (_active) {
      this.props.onFavorite(false);
    } else {
      this.props.onFavorite(true);
    }
  };
  render() {
    const { _active } = this.state;
    const { twink,size } = this.props;
    const heartClass = classNames('toggle-heart', {
      'toggle-heart--active': _active
    });
    const heartIcon = classNames('iconfont icon-iosheart', {
      'icon-iosheart--active': _active,
      'inout': twink
    });
    return (
      <View className={heartClass} onClick={this.handleClick}>
        <View className={heartIcon}  style={{fontSize:size}}/>
      </View>
    );
  }
}
export default Heart;
