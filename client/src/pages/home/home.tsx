import Taro, { Component, Config } from '@tarojs/taro';
import { View, Image, Text, OpenData, Button } from '@tarojs/components';
import { connect } from '@tarojs/redux';
import classNames from 'classnames';

import { IHomeProps, IHomeState } from './home.interface';
import './home.scss';

import { upgrade } from '@/utils/autoUpgrade';
import { getCurrentPageUrl, isNight, globalData } from '@/utils/common';
import {
  Copyright,
  OpenSetting,
  ActionPanel,
  ActionPanelItem,
  ShareMoment,
  Clock
} from '@/components';
import { show } from '@/utils/animation';

@connect(({ home }) => ({
  ...home
}))
class Home extends Component<IHomeProps, IHomeState> {
  config: Config = {
    navigationBarTitleText: 'Have a nice day'
  };

  refreshingQuote: boolean = false;
  //定时器
  weatherTimeId: any;

  constructor(props: IHomeProps) {
    super(props);
    this.state = {
      showOpenSetting: false,
      showActionPanel: false,
      showShareMoment: false,
      located: false,
      bgLoaded: false,
      ani: {}
    };
  }

  componentWillMount() {
    // 检查更新
    upgrade();
  }
  componentDidMount() {}

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
  onBackgroundLoad = () => {};

  /**
   * * 刷新quote
   */
  handleRefresh = () => {};

  /**
   * * 关闭小程序设置弹窗
   */
  handleCloseOpenSetting = () => {};

  /**
   * * 打开分享面板
   */
  handleOpenShare = () => {};

  /**
   * * 关闭分享面板
   */
  handleCloseActionPanel = () => {};

  // 转发
  handleForward = () => {};

  // 打开生成朋友圈图片弹窗
  handleShareMoment = () => {};

  // 关闭朋友圈图片弹窗
  handleCloseShareMoment = () => {};

  // 初始化数据
  initData = () => {
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

  setQuote = () => {};

  setDailyPhoto = () => {};

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
      Taro.vibrateShort();
      this.props.dispatch({
        type: 'home/getWeather',
        payload: { location, key: globalData.weatherKey },
        callback: () => {
          show(this, 'weather', 0.8, 0, 1500);
        }
      });
    }, 1000);
  };

  getGreeting = () => {
    this.props.dispatch();
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
    const { weather, quote, dailyPhoto, greetings } = this.props;
    const {
      showOpenSetting,
      showActionPanel,
      showShareMoment,
      ani
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

    const greetingList = greetings.map(greeting => {
      <Text key={greeting._id}>greeting.message</Text>;
    });
    return (
      <View className="fx-index-wrap">
        <View className="daily-image-wrap">
          {/* <Image
            className="daily-image-default"
            src={bgDog}
            mode="aspectFill"
            animation={ani.defaultBg}
          /> */}
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
          <View className="top-wrap">
            <View className="user-wrap">
              <OpenData
                type="userAvatarUrl"
                className="user-avatar"
                animation={ani.userAvatar}
              />
              <View className="greeting-wrap">
                <View className="twink-round twink" />
                <View className="greeting-text" animation={ani.greeting}>
                  {greetingList}
                </View>
              </View>
            </View>

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
                <Text className="quote-info__text">
                  &#8220;{quote.hitokoto}&#8221;
                </Text>
                <Text className="quote-info__author">
                  &lceil;{` ${quote.from} `}&rfloor;
                </Text>
              </View>
            )}
          </View>
          <View className="iconfont-wrap">
            <Text className={refreshClass} onClick={this.handleRefresh} />
            <View
              className="iconfont icon-share"
              onClick={this.handleOpenShare}
            ></View>
          </View>
        </View>
        <Copyright />
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
            title="保存到相册"
          />
        </ActionPanel>
        <ShareMoment
          isOpened={showShareMoment}
          onClose={this.handleCloseShareMoment}
          src={dailyPhoto.localPath}
          quote={quote}
        />
      </View>
    );
  }
}
export default Home;
