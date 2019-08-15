import Taro, { Component, Config } from '@tarojs/taro';
import { View, Text, Image } from '@tarojs/components';
import { connect } from '@tarojs/redux';
// import Api from '@/utils/httpRequest'
// import Tips from '@/utils/tips'
import { IndexProps, IndexState } from './index.interface';
import './index.scss';
import { AtAvatar } from 'taro-ui';
import { OpenSetting, Clock, Copyright } from '@/components';
import { globalData, isNight } from '@/utils/common';
import bgDog from '@/assets/bg/bg_dog.jpg';
import { show } from '@/utils/animation';
// import { Demo } from '@/components'
@connect(({ index, loading }) => ({
  ...index,
  loading
}))
class Index extends Component<IndexProps, IndexState> {
  config: Config = {
    navigationBarTitleText: '每日好心情',
    enablePullDownRefresh: true
  };
  constructor(props: IndexProps) {
    super(props);
    this.state = {
      showOpenSetting: false,
      // 是否已定位
      located: false,
      //背景图是否已加载完成
      bgLoaded: false,
      ani: {}
    };
  }
  // 对应微信小程序 onLoad()
  componentDidMount() {
    this._reloadPage();
    show(this, 'userAvatar', 1, 200, 2000);
    show(this, 'clock', 1, 200, 2000);
  }
  // 对应微信小程序的onShow()
  componentDidShow() {}

  onHideOpenSetting = () => {
    Taro.vibrateShort();
    this.setState({
      showOpenSetting: false
    });
  };
  onPullDownRefresh = () => {
    Taro.stopPullDownRefresh();
    this._reloadPage();
  };

  onBgLoaded = () => {
    show(this, 'defaultBg', 0, 200, 2000);
    show(this, 'bg', 1, 200, 2000);

    this.setState({
      bgLoaded: true
    });
  };

  // （重）加载页面数据
  _reloadPage = () => {
    this._setWeatherAndLocation();
    this._getQuote();
    //this._setBackgroud();
  };

  /** 设置背景图片 */
  _setBackgroud = () => {
    if (!this.state.bgLoaded) {
      this._getDailyImage();
    }
  };

  _getDailyImage = () => {
    this.props.dispatch({
      type: 'index/getDailyImage',
      payload: {
        collections: `8349391,8349361`,
        client_id: globalData.unsplashClientId
      }
    });
  };

  _getQuote = () => {
    show(this, 'quote', 0, 0, 1500);
    setTimeout(() => {
      this.props.dispatch({
        type: 'index/getQuote',
        payload: {
          c: 'g'
        },
        callback: () => {
          show(this, 'quote', 1, 0, 2000);
        }
      });
    }, 1500);
  };
  /** 设置时钟 */
  _setClock = () => {};

  // 设置当前位置及天气信息
  _setWeatherAndLocation = () => {
    this._checkLocationPermission(this._getUserLocationInfo);
  };
  // 获取地理位置授权状态
  _checkLocationPermission = (cb: () => void) => {
    Taro.getSetting({
      success: res => {
        // 从未授权地理位置或者已经拒绝
        if (!res.authSetting['scope.userLocation']) {
          Taro.vibrateShort();
          Taro.authorize({ scope: 'scope.userLocation' }).then(() => {
            this._locationAccept();
            cb();
          }, this._locationReject);
        } else {
          // 已授权过
          this.setState({
            located: true
          });
          cb();
        }
      }
    });
  };

  // 用户同意地理位置授权
  _locationAccept = () => {
    this.setState({
      located: true
    });
  };
  // 用户拒绝地理位置授权
  _locationReject = () => {
    this.setState({
      showOpenSetting: true,
      located: false
    });
  };

  // 获取用户地理位置信息
  _getUserLocationInfo = () => {
    Taro.getLocation({
      type: 'wgs84',
      // 使用箭头函数，this引用 回调
      success: res => {
        const latitude = res.latitude;
        const longitude = res.longitude;
        this._getWeather(`${latitude},${longitude}`);
      }
    });
  };
  // 获取天气及区域信息
  _getWeather = (location: string) => {
    Taro.vibrateShort();
    this.props.dispatch({
      type: 'index/getWeather',
      payload: { location, key: globalData.weatherKey }
    });
  };

  render() {
    const { weather, quote } = this.props;
    const { showOpenSetting, ani } = this.state;
    const weatherIconStyle = weather && {
      mask: `url(https://cdn.heweather.com/cond_icon/${
        weather.now.cond_code
      }.png) no-repeat`,
      '-webkit-mask': `url(https://cdn.heweather.com/cond_icon/${
        weather.now.cond_code
      }${isNight() ? 'n' : ''}.png) no-repeat`,
      '-webkit-mask-size': '100% 100%',
      'mask-size': '100% 100%'
    };
    return (
      <View className="fx-index-wrap">
        <View className="daily-image-wrap">
          <Image
            className="daily-image-default"
            src={bgDog}
            mode="aspectFill"
            animation={ani.defaultBg}
          />
          <Image
            className="daily-image"
            src="https://source.unsplash.com/user/suchenrain/likes/600x960"
            mode="aspectFill"
            onLoad={this.onBgLoaded}
            animation={ani.bg}
          />
        </View>
        <View className="mask-layer" />
        <View className="content-wrap">
          <Text className="index-title">每天好心情</Text>
          <View className="weather-wrap">
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
                    {/* <Image
                      className="weather-info__icon"
                      src={`https://cdn.heweather.com/cond_icon/${
                        weather.now.cond_code
                      }.png`}
                    /> */}
                  </View>
                  <Text className="weather-info__location">
                    {`${weather.basic.parent_city} ${weather.basic.location}`}
                  </Text>
                </View>
              </View>
            )}
          </View>
          <View className="user-wrap" animation={ani.userAvatar}>
            <AtAvatar
              className="user-avatar"
              circle
              size="large"
              openData={{ type: 'userAvatarUrl' }}
            />
          </View>
          <View className="clock-wrap" animation={ani.clock}>
            <Clock />
          </View>
          <View className="quote-wrap" animation={ani.quote}>
            {quote && (
              <View className="quote-info">
                <Text className="quote-info__text">{quote.hitokoto}</Text>
                <Text className="quote-info__author">
                  &lceil;{` ${quote.from} `}&rfloor;
                </Text>
              </View>
            )}
          </View>
        </View>
        <Copyright />
        <OpenSetting
          isOpened={showOpenSetting}
          onCancel={this.onHideOpenSetting}
          onOk={this.onHideOpenSetting}
        />
      </View>
    );
  }
}
export default Index;
