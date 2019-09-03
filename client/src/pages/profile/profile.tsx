import Taro, { Component, Config } from '@tarojs/taro';
import { View, OpenData, Text } from '@tarojs/components';
// import { connect } from '@tarojs/redux'

// import Api from '@/utils/httpRequest'
// import Tips from '@/utils/tips'
// import {  } from '@/components'
import { IProfileProps, IProfileState } from './profile.interface';

import './profile.scss';

import demoBg from '@/assets/bg/default.jpg';

// @connect(({ profile }) => ({
//     ...profile,
// }))
class Profile extends Component<IProfileProps, IProfileState> {
  config: Config = {
    navigationStyle: 'custom',
    navigationBarTitleText: '收藏',
    enablePullDownRefresh: false
  };
  constructor(props: IProfileProps) {
    super(props);
    this.state = {
      current: 0
    };
  }
  componentDidMount() {}

  clickTab = (current: number) => e => {
    this.setState({ current });
  };

  handleTabChange = e => {
    this.setState({
      current: e.detail.current
    });
  };

  render() {
    const headerBg = demoBg;
    const { current } = this.state;
    return (
      <View className="profile">
        <View
          className="profile-userinfo"
          style={{ backgroundImage: `url("${headerBg}")` }}
        >
          <View className="profile-avatar">
            <OpenData type="userAvatarUrl"></OpenData>
          </View>
          <View className="profile-nickname">
            <OpenData type="userNickName"></OpenData>
          </View>
        </View>
        <View className="tabswiper">
          <View
            className={`tabswiper-tab ${
              current == 0 ? 'tabswiper-tab--active' : ''
            }`}
            onClick={this.clickTab(0)}
          >
            图片
          </View>
          <View
            className={`tabswiper-tab ${
              current == 1 ? 'tabswiper-tab--active' : ''
            }`}
            onClick={this.clickTab(1)}
          >
            一言
          </View>
        </View>
        <View>
          <View className={`photo ${current == 0 ? 'display' : 'hidden'}`}>
            photo
          </View>
          <View className={`quote ${current == 1 ? 'display' : 'hidden'}`}>
            <View className="quote-item">
              <View className="quote-text">
                “Patience and perseverance have a magical effect before which
                difficulties disappear and obstacles vanish.”
                <Text className="quote-author">Phil Jackson</Text>
              </View>
            </View>
            <View className="quote-item">
              <View className="quote-text">
                “不管怎么样，未来都是可以改变的。”
                <Text className="quote-author">雏菊</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  }
}
export default Profile;
