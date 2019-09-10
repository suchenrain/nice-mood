import Taro, { Component, Config } from '@tarojs/taro';
import { View, Image, Text, OpenData, Button } from '@tarojs/components';
import { connect } from '@tarojs/redux';
import classNames from 'classnames';

import { IHomeProps, IHomeState } from './home.interface';
import defaultBg from '@/assets/bg/default.jpg';
import './home.scss';

import { upgrade } from '@/utils/autoUpgrade';
import {
  getCurrentPageUrl,
  isNight,
  globalData,
  getGlobalData
} from '@/utils/common';
import {
  Copyright,
  OpenSetting,
  ActionPanel,
  ActionPanelItem,
  ShareMoment,
  Clock,
  TouchBall,
  Heart,
  SearchBar
} from '@/components';
import { show } from '@/utils/animation';
import { ISetting } from '@/types';
import Tips from '@/utils/tips';
import { PAGES } from '@/config/weappConfig';

@connect(({ home }) => ({
  ...home
}))
class Home extends Component<IHomeProps, IHomeState> {
  config: Config = {
    navigationStyle: 'custom',
    navigationBarTitleText: 'Have a nice day',
    enablePullDownRefresh: true
  };

  refreshingQuote: boolean = false;
  //定时器
  weatherTimeId: any;
  quoteTimeId: any;
  greetingTimeId: any;
  greetingIntvalId: any;

  constructor(props: IHomeProps) {
    super(props);
    this.state = {
      showOpenSetting: false,
      showActionPanel: false,
      showShareMoment: false,
      greeting: 'Have a nice day:)',
      located: false,
      searchText: '',
      bgLoaded: false,
      likeQuote: false,
      likePhoto: false,
      ani: {}
    };
  }

  componentWillMount() {
    const setting: ISetting = getGlobalData('setting');
    if (setting.enableUpdateCheck) {
      // 检查更新
      upgrade();
    }
  }
  componentDidMount() {
    this.init();
    show(this, 'userAvatar', 0.7, 500, 2000);
    show(this, 'clock', 1, 500, 2000);
  }

  componentWillUnmount() {
    this.weatherTimeId && clearTimeout(this.weatherTimeId);
    this.quoteTimeId && clearTimeout(this.quoteTimeId);
    this.greetingTimeId && clearTimeout(this.greetingTimeId);
    this.greetingIntvalId && clearInterval(this.greetingIntvalId);
  }

  onShareAppMessage() {
    const title = this.props.quote.hitokoto;
    const imageUrl = this.props.dailyPhoto.localPath;
    const path = getCurrentPageUrl();
    return {
      title: title,
      path: path,
      imageUrl: imageUrl
    };
  }
  /**
   * * 下拉刷新
   */
  onPullDownRefresh() {
    Taro.stopPullDownRefresh();
    this.handleRefresh();
  }

  /**
   * * daily photo 加载完成
   */
  onBackgroundLoad = () => {
    show(this, 'defaultBg', 0, 300, 3000);
    show(this, 'bg', 1, 300, 3000);
    this.setState({
      bgLoaded: true
    });
  };

  /**
   * * 下拉刷新
   */
  handleRefresh = () => {
    this.reloadData();
  };
  /**
   * * 刷新quote
   */
  handleRefreshQuote = () => {
    this.setQuote();
  };

  /**
   * * 关闭小程序设置弹窗
   */
  handleCloseOpenSetting = () => {
    this.setState(
      {
        showOpenSetting: false
      },
      Taro.vibrateShort
    );
  };

  /**
   * * 打开分享面板
   */
  handleOpenShare = () => {
    this.setState({ showActionPanel: true }, Taro.vibrateShort);
  };

  /**
   * * 关闭分享面板
   */
  handleCloseActionPanel = () => {
    this.setState({
      showActionPanel: false
    });
  };

  // 点击转发给朋友
  handleForward = () => {};

  // 打开生成朋友圈图片弹窗
  handleShareMoment = () => {
    this.setState({ showShareMoment: true }, this.handleCloseActionPanel);
  };

  // 关闭朋友圈图片弹窗
  handleCloseShareMoment = () => {
    this.setState({
      showShareMoment: false,
      showActionPanel: true
    });
  };

  /**
   * quote heart点击回调
   */
  handleQuoteHeart = (fond: boolean) => {
    this.setState(
      {
        likeQuote: fond
      },
      () => {
        this.upsertFondQuote(fond);
      }
    );
  };

  handlePhotoHeart = (fond: boolean) => {
    this.setState(
      {
        likePhoto: fond
      },
      () => {
        this.upsertFondPhoto(fond);
      }
    );
  };

  handleSearchTextChange = value => {
    this.setState({ searchText: value });
  };

  handleSearch = () => {
    const { searchText } = this.state;
    if (!searchText) return;
    this.searchWeather(searchText);
  };

  // 初始化
  init = () => {
    this.reloadData();
  };

  navigate2Profile = e => {
    e.stopPropagation();
    e.preventDefault();
    Taro.navigateTo({ url: PAGES.PROFILE });
  };

  //加载数据
  reloadData = () => {
    this.setWeather();
    this.setGreeting();
    this.setQuote();
    this.setDailyPhoto();
  };

  setWeather = () => {
    this.checkLocationPermission(this.getUserLocationInfo);
  };

  setGreeting = () => {
    this.getGreeting();
  };

  setQuote = () => {
    this.getQuote();
  };

  setDailyPhoto = () => {
    if (!this.state.bgLoaded) {
      this.getDailyPhoto();
    }
  };

  /**
   * 更新收藏quote
   */
  upsertFondQuote = (fond: boolean) => {
    const { quote } = this.props;
    this.props.dispatch({
      type: 'home/upsertFondQuote',
      payload: {
        quote: quote,
        fond: fond
      },
      callback: (err, res) => {
        if (err) {
          this.setState({ likeQuote: !fond }, () => {
            Tips.toast(fond ? '收藏失败' : '取消失败');
          });
        }
        if (res) {
          Tips.success(fond ? '已加入收藏' : '已取消收藏');
        }
      }
    });
  };
  /**
   * 更新收藏photo
   */
  upsertFondPhoto = (fond: boolean) => {
    const { dailyPhoto } = this.props;
    this.props.dispatch({
      type: 'home/upsertFondPhoto',
      payload: {
        pid: dailyPhoto.pid,
        fond: fond
      },
      callback: (err, res) => {
        if (err) {
          this.setState({ likePhoto: !fond }, () => {
            Tips.toast(fond ? '收藏失败' : '取消失败');
          });
        }
        if (res) {
          Tips.success(fond ? '已加入收藏' : '已取消收藏');
        }
      }
    });
  };

  /*
  |--------------------------------------
  |  functional methods
  |--------------------------------------
  */

  /**
   * 检查用户地理位置授权状态
   * @param cb 已授权时回调的方法
   */
  checkLocationPermission = (cb: () => void) => {
    Taro.getSetting({
      success: res => {
        const permisson = 'scope.userLocation';
        // 从未授权地理位置或者已经拒绝
        if (!res.authSetting[permisson]) {
          Taro.vibrateShort();
          Taro.authorize({ scope: permisson })
            .then(() => {
              this.setState(
                {
                  located: true
                },
                cb
              );
            })
            .catch(err => {
              this.setState({
                showOpenSetting: true,
                located: false
              });
            });
        } else {
          // 已授权过
          this.setState(
            {
              located: true
            },
            cb
          );
        }
      }
    });
  };
  // 获取用户当前地理位置信息
  getUserLocationInfo = () => {
    Taro.getLocation({
      type: 'wgs84',
      // 使用箭头函数，this引用 回调
      success: res => {
        const latitude = res.latitude;
        const longitude = res.longitude;
        this.getWeather(`${latitude},${longitude}`);
      }
    });
  };
  // 获取天气及区域信息
  getWeather = (location: string) => {
    if (this.weatherTimeId) clearTimeout(this.weatherTimeId);
    show(this, 'weather', 0, 0, 1000);
    this.weatherTimeId = setTimeout(() => {
      // Taro.vibrateShort();
      this.props.dispatch({
        type: 'home/getWeather',
        payload: { location, key: globalData.weatherKey },
        callback: status => {
          show(this, 'weather', 0.8, 0, 1500);
        }
      });
    }, 1000);
  };

  searchWeather = (location: string) => {
    Taro.vibrateShort();
    Tips.loading('查询中...');
    this.props.dispatch({
      type: 'home/getWeather',
      payload: { location, key: globalData.weatherKey },
      callback: status => {
        Tips.loaded();
        if (status === 'ok') {
          Tips.success('天气信息已更新');
        } else {
          Tips.toast('未检索到结果');
        }
        show(this, 'weather', 0.8, 0, 1500);
      }
    });
  };

  getGreeting = () => {
    this.props.dispatch({
      type: 'home/getGreeting',
      callback: () => {
        this.randomGreeting();
        if (this.greetingIntvalId) clearInterval(this.greetingIntvalId);
        this.greetingIntvalId = setInterval(this.randomGreeting, 6000);
      }
    });
  };

  randomGreeting = () => {
    if (this.greetingTimeId) clearTimeout(this.greetingTimeId);
    show(this, 'greeting', 0, 0.1, 2000);
    const greetings = this.props.greetings;
    let greeting =
      greetings[Math.floor(Math.random() * greetings.length)].message;
    this.greetingTimeId = setTimeout(() => {
      this.setState({ greeting }, () => {
        show(this, 'greeting', 0.7, 0, 2000);
      });
    }, 2000);
  };

  getQuote = () => {
    if (this.quoteTimeId) clearTimeout(this.quoteTimeId);
    this.refreshingQuote = true;
    show(this, 'quote', 0, 0, 1000);
    this.quoteTimeId = setTimeout(() => {
      this.props.dispatch({
        type: 'home/getQuote',
        payload: {
          // c: 'k'
        },
        callback: () => {
          // preset like status
          this.setState({
            likeQuote: this.props.quote.fond || false
          });

          Taro.vibrateShort();
          this.refreshingQuote = false;
          show(this, 'quote', 1, 0, 2000);
        }
      });
    }, 1000);
  };

  getDailyPhoto = () => {
    this.props.dispatch({
      type: 'home/getDailyPhoto'
    });
  };

  /**
   * 是否有夜间天气图标
   */
  hasNightIcon = code => {
    return [100, 103, 104, 300, 301, 406, 407].indexOf(code) > -1;
  };

  /*
  |--------------------------------------
  |  render
  |--------------------------------------
  */

  render() {
    const { weather, quote, dailyPhoto } = this.props;
    const {
      showOpenSetting,
      showActionPanel,
      showShareMoment,
      greeting,
      likePhoto,
      likeQuote,
      ani,
      searchText
    } = this.state;
    const code = weather && weather.now.cond_code;
    const hasNight = weather && this.hasNightIcon(code);

    const weatherIconStyle = weather && {
      mask: `url(https://cdn.heweather.com/cond_icon/${code}${
        isNight() && hasNight ? 'n' : ''
      }.png) no-repeat`,
      '-webkit-mask': `url(https://cdn.heweather.com/cond_icon/${code}${
        isNight() && hasNight ? 'n' : ''
      }.png) no-repeat`,
      '-webkit-mask-size': '100% 100%',
      'mask-size': '100% 100%'
    };

    const refreshClass = classNames('iconfont', 'icon-refresh', {
      'icon-refresh--active': this.refreshingQuote
    });

    const setting: ISetting = getGlobalData('setting');

    return (
      <View className="fx-index-wrap">
        <View className="daily-image-wrap">
          <Image
            className="daily-image-default"
            src={defaultBg}
            mode="aspectFill"
            animation={ani.defaultBg}
          />
          <Image
            className="daily-image"
            src={dailyPhoto.localPath}
            mode="aspectFill"
            onLoad={this.onBackgroundLoad}
            animation={ani.bg}
          />
        </View>
        <View className="mask-layer" />
        <View className="content-wrap">
          <Text className="index-title">每天好心情</Text>
          {setting.enableWeatherSearch && (
            <View className="search-bar-wrap">
              <SearchBar
                value={searchText}
                onChange={this.handleSearchTextChange}
                onActionClick={this.handleSearch}
                onBlur={this.handleSearch}
              ></SearchBar>
            </View>
          )}
          <View className="top-wrap">
            {setting.enableGreeting && (
              <View className="user-wrap" onClick={this.navigate2Profile}>
                <OpenData
                  type="userAvatarUrl"
                  className="user-avatar"
                  animation={ani.userAvatar}
                />
                <View className="greeting-wrap">
                  <View className="twink-round twink" />
                  <View className="greeting-text" animation={ani.greeting}>
                    {greeting}
                  </View>
                </View>
              </View>
            )}

            <View className="weather-wrap" animation={ani.weather}>
              {weather && (
                <View className="weather-info">
                  <Text className="weather-info__tmp">
                    {weather.now.tmp}&deg;
                  </Text>
                  <View className="weather-info__rightbox">
                    <View className="weather-info__condicon">
                      <Text className="weather-info__cond">
                        {weather.now.cond_txt}
                      </Text>
                      <View
                        className="weather-info__icon--mask"
                        style={weatherIconStyle}
                      />
                    </View>
                    <Text className="weather-info__location">
                      {`${weather.basic.parent_city} ${weather.basic.location}`}
                    </Text>
                  </View>
                </View>
              )}
            </View>
          </View>

          <View className="clock-wrap" animation={ani.clock}>
            <Clock />
          </View>
          <View className="quote-wrap" animation={ani.quote}>
            {quote && (
              <View className="quote-info">
                <View className="quote-info__text">
                  &#8220;{quote.hitokoto}&#8221;
                  <Heart
                    twink={true}
                    size="24px"
                    active={likeQuote}
                    onFavorite={this.handleQuoteHeart}
                  />
                </View>

                <Text className="quote-info__author">
                  &lceil;{` ${quote.from} `}&rfloor;
                </Text>
              </View>
            )}
          </View>
          <View className="iconfont-wrap">
            <Text className={refreshClass} onClick={this.handleRefreshQuote} />
            <View
              className="iconfont icon-share"
              onClick={this.handleOpenShare}
            />
          </View>
        </View>
        {dailyPhoto._id && (
          <View className="photo-copyright">
            <View className="photo-copyright__text">
              Photo by {dailyPhoto.author}
              <Heart
                twink={true}
                size="1rem"
                active={likePhoto}
                onFavorite={this.handlePhotoHeart}
              />
            </View>
          </View>
        )}
        {!dailyPhoto._id && <Copyright />}
        <TouchBall />
        <OpenSetting
          isOpened={showOpenSetting}
          onCancel={this.handleCloseOpenSetting}
          onOk={this.handleCloseOpenSetting}
        />
        <ActionPanel
          cancelText="取消"
          isOpened={showActionPanel}
          className="action-panel-wrap"
          onCancel={this.handleCloseActionPanel}
          onClose={this.handleCloseActionPanel}
        >
          <ActionPanelItem
            onClick={this.handleForward}
            icon="icon-fasong"
            title="发送给朋友"
          >
            <Button className="share-btn" size="mini" openType="share" />
          </ActionPanelItem>
          <ActionPanelItem
            onClick={this.handleShareMoment}
            icon="icon-camera"
            title="生成图签"
          />
        </ActionPanel>
        <ShareMoment
          isOpened={showShareMoment}
          isLocal={!dailyPhoto._id}
          onClose={this.handleCloseShareMoment}
          src={dailyPhoto.localPath}
          quote={quote}
        />
      </View>
    );
  }
}
export default Home;
