import Taro, { Component, Config } from '@tarojs/taro';
import { View, OpenData, Text, ScrollView } from '@tarojs/components';
import { connect } from '@tarojs/redux';

import { IProfileProps, IProfileState } from './profile.interface';

import './profile.scss';

import demoBg from '@/assets/bg/default.jpg';
import { AtSwipeAction } from 'taro-ui';
import Tips from '@/utils/tips';

@connect(({ loading, profile }) => ({
  loading,
  ...profile
}))
class Profile extends Component<IProfileProps, IProfileState> {
  config: Config = {
    navigationStyle: 'custom',
    navigationBarTitleText: '我的收藏',
    enablePullDownRefresh: false,
    onReachBottomDistance: 15
  };
  constructor(props: IProfileProps) {
    super(props);
    this.state = {
      current: 0, //active tab
      quotePageIndex: 1,
      quoteInited: false,
      activeQuoteId: 0,
      photoInited: false,
      photoPageIndex: 1
    };
  }
  componentDidMount() {
    this.loadData();
  }
  onReachBottom() {
    const { current, quotePageIndex } = this.state;
    const { totalQuotePage, loading } = this.props;
    if (
      current == 1 &&
      !loading.effects['profile/getFondQuotes'] &&
      quotePageIndex <= totalQuotePage
    ) {
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
      success: () => {
        const nextPage = quotePageIndex + 1;

        this.setState({
          quotePageIndex: nextPage,
          quoteInited: true
        });
      },
      fail: () => {}
    });
  };

  back = () => {
    Taro.navigateBack();
  };

  handleToggleTab = (current: number) => e => {
    this.setState({ current }, () => {
      if (current == 1 && !this.state.quoteInited) {
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
  handleQuoteRemove = (id: number) => e => {
    // e: {text:"移除",style:{}}
    this.props.dispatch({
      type: 'profile/upsertFondQuote',
      payload: {
        quote: { id },
        fond: false
      },
      success: () => {
        Tips.success('移除成功');
      },
      fail: err => {
        Tips.toast('移除失败');
      }
    });
  };

  render() {
    const headerBg = demoBg;
    const { current, activeQuoteId, quoteInited, quotePageIndex } = this.state;

    // quotes
    const { quotes, loading, totalQuotePage } = this.props;

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
          onClick={this.handleQuoteRemove(quote.id)}
        >
          <View className="quote-item">
            <View className="quote-text">&#8220;{quote.hitokoto}&#8221;</View>
            <Text className="quote-author">&#761;{quote.from}&#764;</Text>
            {/* <Text className="quote-author">｢{quote.from}｣</Text> */}
          </View>
        </AtSwipeAction>
      );
    });

    return (
      <View className="profile">
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
            {quoteInited && quotes.length == 0 && (
              <View className="no-data">空空如也，快去收藏吧</View>
            )}
            {quoteList}
            {loading.effects['profile/getFondQuotes'] && (
              <View className="loading-data">加载中...</View>
            )}
          </View>
        </View>
      </View>
    );
  }
}
export default Profile;
