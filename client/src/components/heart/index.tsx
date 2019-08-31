import Taro, { Component } from '@tarojs/taro';
import { View } from '@tarojs/components';
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
  // static options = {
  //   addGlobalClass: true
  // }

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
      this.props.unlike();
    } else {
      this.props.like();
    }
  };
  render() {
    const { _active } = this.state;
    const heartClass = classNames('heart-animation', {
      'heart-animation--active': _active
    });
    return <View className={heartClass} onClick={this.handleClick}></View>;
  }
}
export default Heart;
