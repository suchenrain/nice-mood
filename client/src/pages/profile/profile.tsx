import Taro, { Component, Config } from '@tarojs/taro';
import { View, OpenData, Text } from '@tarojs/components';
// import { connect } from '@tarojs/redux'

// import Api from '@/utils/httpRequest'
// import Tips from '@/utils/tips'
// import {  } from '@/components'
import { IProfileProps, IProfileState } from './profile.interface';

import './profile.scss';

import demoBg from '@/assets/bg/default.jpg';
import { AtSwipeAction } from 'taro-ui';
import { IQuote } from '../../types';

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
      current: 0,
      activeQuoteId: 0
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

  /**
   * 切换
   */
  handleSingle = id => () => {
    this.setState({ activeQuoteId: id });
  };
  // 关闭所有
  handleResetSingle = () => {
    this.setState({ activeQuoteId: 0 });
  };

  //移除
  handleRemove = e => {
    // {text:"移除",style:{}}
  };

  render() {
    const headerBg = demoBg;
    const { current, activeQuoteId } = this.state;

    // quotes
    // const { quotes } = this.props;
    const quotes: Array<IQuote> = [
      {
        id: 1,
        hitokoto: `If you don't like where you are, change it. You're not a tree.`,
        from: 'Jim Rohn'
      },
      {
        id: 2,
        hitokoto: '求之不得，寤寐思服。悠哉悠哉，辗转反侧。',
        from: '关雎'
      }
    ];

    const swipeActionOption = [
      {
        text: '移除',
        style: {
          backgroundColor: '#FF4949'
        }
      }
    ];
    const quoteList = quotes.map(quote => {
      return (
        <AtSwipeAction
          key={quote.id}
          options={swipeActionOption}
          onOpened={this.handleSingle(quote.id)}
          isOpened={activeQuoteId == quote.id}
          onClosed={this.handleResetSingle}
          onClick={this.handleRemove}
        >
          <View className="quote-item">
            <View className="quote-text">
              “{quote.hitokoto}”
              <Text className="quote-author">{quote.from}</Text>
            </View>
          </View>
        </AtSwipeAction>
      );
    });

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
            {quotes.length == 0 && <View>你还没有喜欢的句子呢</View>}
            {quoteList}
          </View>
        </View>
      </View>
    );
  }
}
export default Profile;
