import Taro, { Component } from '@tarojs/taro';
import { View } from '@tarojs/components';

import { IClockProps, IClockState } from './index.interface';
import './index.scss';
import { pad } from '@/utils/common';

class Clock extends Component<IClockProps, IClockState> {
  constructor(props: IClockProps) {
    super(props);
    this.state = {
      datetime: new Date(),
      timerID: undefined
    };
  }
  static options = {
    addGlobalClass: true
  };
  static defaultProps: IClockProps = {};

  componentDidMount() {
    let timerID = setInterval(() => this.tick(), 1000);
    this.setState({ timerID });
  }

  componentWillUnmount() {
    const { timerID } = this.state;
    clearInterval(timerID);
  }

  tick = () => {
    this.setState({ datetime: new Date() });
  };

  render() {
    const { datetime } = this.state;
    const formatTime = `${pad(datetime.getHours())}:${pad(
      datetime.getMinutes()
    )}`;
    return (
      <View className="fx-clock">
        <View className="time-text">{formatTime}</View>
      </View>
    );
  }
}
export default Clock;
