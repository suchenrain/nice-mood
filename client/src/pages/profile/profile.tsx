import Taro, { Component, Config } from '@tarojs/taro';
import { View, OpenData, Text, Image } from '@tarojs/components';
import { connect } from '@tarojs/redux';

import { IProfileProps, IProfileState } from './profile.interface';

import './profile.scss';

import { AtSwipeAction, AtActionSheet, AtActionSheetItem } from 'taro-ui';
import Tips from '@/utils/tips';
import { getGlobalData } from '@/utils/common';

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

  swiping: boolean;
  blankHeight: number;

  constructor(props: IProfileProps) {
    super(props);
    this.state = {
      current: 0, //active tab
      quotePageIndex: 1,
      quoteInited: false,
      activeQuoteId: 0,
      photoInited: false,
      photoTimeLine: new Date(),
      nomorePhoto: false,
      nomoreQuote: false,
      photoConfirmRemove: false,
      photoToBeRemove: '',
      tabTopHeight: 0,
      tabHeight: 0,
      reachTop: false
    };
  }
  componentDidMount() {
    this.setTabTopHeight();
    this.setBlankHeight();
    this.loadData();
  }

  // 设置需要填充的高度
  setBlankHeight = () => {
    const systeminfo = getGlobalData('systemInfo');
    const windowHeight = systeminfo.windowHeight || 0;
    this.blankHeight = (6 * windowHeight) / 100;
  };
  setTabTopHeight = () => {
    Taro.createSelectorQuery()
      .select('.tabswiper')
      .boundingClientRect((rect: any) => {
        // console.log(rect);
        this.setState({
          tabTopHeight: rect.top,
          tabHeight: rect.height
        });
      })
      .exec();
  };

  onReachBottom() {
    const { current, quotePageIndex, photoPageIndex } = this.state;
    const { totalQuotePage, totalPhotoPage, loading } = this.props;
    // quote tab
    if (current == 1) {
      const loadingQuote = loading.effects['profile/getFondQuotes'];
      if (!loadingQuote && quotePageIndex <= totalQuotePage) {
        this.fetchQuotes();
      }
      if (quotePageIndex > totalQuotePage) {
        this.setState({ nomoreQuote: true });
      }
    }
    // photo tab
    if (current == 0) {
      const loadingPhoto = loading.effects['profile/getFondPhotos'];
      if (!loadingPhoto && photoPageIndex <= totalPhotoPage) {
        this.fetchPhotos();
      }
      if (photoPageIndex > totalPhotoPage) {
        this.setState({ nomorePhoto: true });
      }
    }
  }

  onPageScroll = e => {
    if (this.swiping) return;
    const { tabTopHeight } = this.state;
    if (e.scrollTop >= tabTopHeight) {
      this.setState({ reachTop: true });
    } else if (e.scrollTop < tabTopHeight) {
      this.setState({ reachTop: false });
    }
  };

  swipeStart = () => {
    this.swiping = true;
  };

  swipeEnd = () => {
    this.swiping = false;
  };

  loadData = () => {
    this.fetchPhotos();
  };
  /**
   * * 拉取photos 分页
   */
  fetchPhotos = () => {
    const { photoTimeLine } = this.state;
    this.props.dispatch({
      type: 'profile/getFondPhotos',
      payload: {
        timeLine: photoTimeLine
      },
      success: () => {
        const timeLine=this.props.photos
        this.setState(
          {
            photoPageIndex: nextPage,
            photoInited: true
          },
          () => {
            Taro.vibrateShort();
          }
        );
      },
      fail: () => {}
    });
  };

  /**
   * * 拉取quotes 分页
   */
  fetchQuotes = () => {
    const { quotePageIndex } = this.state;
    this.props.dispatch({
      type: 'profile/getFondQuotes',
      payload: {
        pageIndex: quotePageIndex
      },
      success: () => {
        const nextPage = quotePageIndex + 1;

        this.setState(
          {
            quotePageIndex: nextPage,
            quoteInited: true
          },
          () => {
            Taro.vibrateShort();
          }
        );
      },
      fail: () => {}
    });
  };

  back = () => {
    Taro.vibrateShort();
    Taro.navigateBack();
  };

  handleToggleTab = (current: number) => e => {
    this.setState({ current }, () => {
      Taro.vibrateShort();
      if (current == 1 && !this.state.quoteInited) {
        this.fetchQuotes();
      }
      if (current == 0 && !this.state.photoInited) {
        this.fetchPhotos();
      }
    });
  };

  /**
   * 切换active quote
   */
  handleSingle = id => () => {
    this.setState({ activeQuoteId: id });
  };
  // 关闭所有
  handleResetSingle = () => {
    this.setState({ activeQuoteId: 0 });
  };

  stopMove = e => {
    e.stopPropagation();
    e.preventDefault();
  };

  // 移除photo 确认
  handleConfirmPhotoRemove = (pid: string) => e => {
    e.stopPropagation();
    e.preventDefault();
    this.setState(
      {
        photoConfirmRemove: true,
        photoToBeRemove: pid
      },
      () => {
        Taro.vibrateShort();
      }
    );
  };

  handleCloseConfirm = () => {
    this.setState({
      photoConfirmRemove: false,
      photoToBeRemove: ''
    });
  };
  // 确认移除
  handlePhotoRemove = () => {
    Taro.vibrateShort();
    this.setState({
      photoConfirmRemove: false,
      photoToBeRemove: ''
    });
    this.props.dispatch({
      type: 'profile/upsertFondPhoto',
      payload: {
        pid: this.state.photoToBeRemove,
        fond: false
      },
      success: () => {
        Tips.success('图片已移除');
      },
      fail: (err: any) => {
        Tips.toast('移除失败');
      }
    });
  };

  //移除quote
  handleQuoteRemove = (id: number) => e => {
    // e: {text:"移除",style:{}}
    Taro.vibrateShort();
    this.props.dispatch({
      type: 'profile/upsertFondQuote',
      payload: {
        quote: { id },
        fond: false
      },
      success: () => {
        this.handleResetSingle();
        Tips.success('移除成功');
      },
      fail: err => {
        Tips.toast('移除失败');
      }
    });
  };

  handlePreview = (current: string) => e => {
    const urls = this.props.photos
      .filter(i => !i.removed)
      .map(p => p.tempFileURL);
    Taro.previewImage({
      urls,
      current: current
    });
  };

  render() {
    const {
      current,
      activeQuoteId,
      quoteInited,
      nomoreQuote,
      photoInited,
      nomorePhoto,
      photoConfirmRemove,
      reachTop,
      tabHeight
    } = this.state;

    const { quotes, photos, loading } = this.props;

    // photo
    const photoList = photos.map(photo => {
      return (
        <View
          className={`photo-item ${photo.removed ? 'photo-item-removed' : ''} ${
            photo.isNew && !photo.removed ? 'photo-item-added' : ''
          }`}
          key={photo._id}
        >
          <Image
            style={{ backgroundColor: photo.color }}
            src={photo.tempFileURL}
            mode="aspectFill"
            className="photo-img"
            onClick={this.handlePreview(photo.tempFileURL)}
          ></Image>
          <Text className="photo-alt">{photo.alt}</Text>
          <View
            className="photo-fond inout iconfont icon-iosheart"
            onClick={this.handleConfirmPhotoRemove(photo.pid)}
          ></View>
        </View>
      );
    });

    // quotes
    const swipeActionOption = [
      {
        text: '不感兴趣',
        style: {
          backgroundColor: '#FF4949',
          fontSize: '17px'
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
          // className={`${quote.removed ? 'quote-item-removed' : ''}`}
        >
          <View
            className={`quote-item ${
              quote.removed ? 'quote-item-removed' : ''
            } ${quote.isNew && !quote.removed ? 'quote-item-added' : ''}`}
            onTouchStart={this.swipeStart}
            onTouchEnd={this.swipeEnd}
          >
            <View className="quote-text">&#8220;{quote.hitokoto}&#8221;</View>
            <Text className="quote-author">&#761;{quote.from}&#764;</Text>
            {/* <Text className="quote-author">｢{quote.from}｣</Text> */}
          </View>
        </AtSwipeAction>
      );
    });

    const avaiablePhoto = photos.find(p => !p.removed);

    return (
      <View className="profile">
        <View
          onClick={this.back}
          className="backicon iconfont icon-right"
        ></View>
        <View
          className="profile-userinfo"
          style={{
            backgroundImage: `url("${
              avaiablePhoto ? avaiablePhoto.tempFileURL : ''
            }")`
          }}
        >
          <View className="profile-avatar">
            <OpenData type="userAvatarUrl"></OpenData>
          </View>
          <View className="profile-nickname">
            <OpenData type="userNickName"></OpenData>
          </View>
        </View>
        <View className={`tabswiper ${reachTop ? 'tabswiper-fixed' : ''}`}>
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
        <View
          className="content-wrap"
          style={{
            marginTop: reachTop ? tabHeight + this.blankHeight + 'px' : '0px'
          }}
        >
          <View className={`photo ${current == 0 ? 'display' : 'hidden'}`}>
            {photoInited && photos.length == 0 && (
              <View className="no-data">空空如也，快去收藏吧</View>
            )}
            {photoList}
            {loading.effects['profile/getFondPhotos'] && (
              <View className="loading-data">加载中...</View>
            )}
            {nomorePhoto && (
              <View className="nomore-data">{`没有更多啦>_<`}</View>
            )}
          </View>
          <View className={`quote ${current == 1 ? 'display' : 'hidden'}`}>
            {quoteInited && quotes.length == 0 && (
              <View className="no-data">空空如也，快去收藏吧</View>
            )}
            {quoteList}
            {loading.effects['profile/getFondQuotes'] && (
              <View className="loading-data">加载中...</View>
            )}
            {nomoreQuote && (
              <View className="nomore-data">{`没有更多啦>_<`}</View>
            )}
          </View>
        </View>
        <AtActionSheet
          isOpened={photoConfirmRemove}
          cancelText="取消"
          title="移除收藏后，该图片将不再显示"
          onClose={this.handleCloseConfirm}
        >
          <AtActionSheetItem onClick={this.handlePhotoRemove}>
            <Text style={{ color: 'red', fontSize: '18px' }}>不再收藏</Text>
          </AtActionSheetItem>
        </AtActionSheet>
      </View>
    );
  }
}
export default Profile;
