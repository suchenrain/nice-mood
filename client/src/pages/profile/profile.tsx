import Taro, { Component, Config } from '@tarojs/taro';
import { View, OpenData } from '@tarojs/components';
// import { connect } from '@tarojs/redux'

// import Api from '@/utils/httpRequest'
// import Tips from '@/utils/tips'
// import {  } from '@/components'
import { IProfileProps, IProfileState } from './profile.interface';

import './profile.scss';

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
    this.state = {};
  }
  componentDidMount() {}
  render() {
    return (
      <View className="profile">
        <View className="profile-userinfo">
          <View className="profile-avatar">
            <OpenData type="userAvatarUrl"></OpenData>
          </View>
          <View className="profile-nickname">
            <OpenData type="userNickName"></OpenData>
          </View>
        </View>
      </View>
    );
  }
}
export default Profile;
