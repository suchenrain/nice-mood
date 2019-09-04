import Taro, { Component, Config } from '@tarojs/taro';
import { View, OpenData, Text, ScrollView } from '@tarojs/components';
import { connect } from '@tarojs/redux';

import { IProfileProps, IProfileState } from './profile.interface';

import './profile.scss';

import demoBg from '@/assets/bg/default.jpg';
import { AtSwipeAction } from 'taro-ui';

@connect(({ profile }) => ({
  ...profile
}))
class Profile extends Component<IProfileProps, IProfileState> {
  config: Config = {
    navigationStyle: 'custom',
    navigationBarTitleText: '收藏',
    enablePullDownRefresh: false
  };
  constructor(props: IProfileProps) {
    super(props);
    this.state = {
      current: 0, //active tab
      quotePageIndex: 1,
      quoteClicked: false,
      loadingQuote: false,
      activeQuoteId: 0
    };
  }
  componentDidMount() {
    this.loadData();
  }
  onReachBottom() {
    const { current, quotePageIndex, loadingQuote } = this.state;
    const { totalQuotePage } = this.props;
    if (current == 1 && !loadingQuote && quotePageIndex <= totalQuotePage) {
      this.fetchQuotes();
    }
  }

  loadData = () => {
    this.fetchPhotos();
  };
  fetchPhotos = () => {};

  fetchQuotes = () => {
    const { quotePageIndex } = this.state;
    this.props.dispatch({
      type: 'profile/getFondQuotes',
      payload: {
        pageIndex: quotePageIndex
      },
      callback: () => {
        const nextPage = quotePageIndex + 1;
        this.setState({ quotePageIndex: nextPage, quoteClicked: true });
      }
    });
  };

  back = () => {
    Taro.navigateBack();
  };

  handleToggleTab = (current: number) => e => {
    this.setState({ current }, () => {
      if (current == 1 && !this.state.quoteClicked) {
        this.fetchQuotes();
      }
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
    const { quotes } = this.props;

    const swipeActionOption = [
      {
        text: '不感兴趣',
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
      <ScrollView scroll-y style="height: 600px" className="profile">
        <View
          onClick={this.back}
          className="backicon iconfont icon-right"
        ></View>
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
            onClick={this.handleToggleTab(0)}
          >
            图片
          </View>
          <View
            className={`tabswiper-tab ${
              current == 1 ? 'tabswiper-tab--active' : ''
            }`}
            onClick={this.handleToggleTab(1)}
          >
            一言
          </View>
        </View>
        <View className="content-wrap">
          <View className={`photo ${current == 0 ? 'display' : 'hidden'}`}>
            photo
          </View>
          <View className={`quote ${current == 1 ? 'display' : 'hidden'}`}>
            {quotes.length == 0 && <View>你还没有喜欢的句子呢</View>}
            {quoteList}
          </View>
        </View>
      </ScrollView>
    );
  }
}
export default Profile;
