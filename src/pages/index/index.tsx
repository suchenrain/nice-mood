import Taro, { Component, Config } from '@tarojs/taro';
import { View, OpenData, Image } from '@tarojs/components';
import { connect } from '@tarojs/redux';
// import Api from '@/utils/httpRequest'
// import Tips from '@/utils/tips'
import { IndexProps, IndexState } from './index.interface';
import './index.scss';
import { AtAvatar, AtToast } from 'taro-ui';
import { OpenSetting } from '@/components';
import { globalData } from '@/utils/common';
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
    this._easeInOut(1, 200, 3000);
    this.setState({
      bgLoaded: true
    });
  };

  _easeInOut = (opacity: number, delay: number, duration: number) => {
    let animation = Taro.createAnimation({
      duration: duration,
      timingFunction: 'ease',
      delay: delay
    });
    animation.opacity(opacity).step();
    this.setState({ ani: animation.export() });
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
    this.props.dispatch({
      type: 'index/getQuote',
      payload: {
        c: 'g'
      }
    });
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
    const { weather, loading, bgImage, quote } = this.props;
    const { showOpenSetting, ani } = this.state;
    return (
      <View className="fx-index-wrap">
        <Image
          className="daily-image"
          src="https://source.unsplash.com/user/suchenrain/likes"
          mode="aspectFill"
          onLoad={this.onBgLoaded}
          animation={ani}
        />
        <View>
          <AtToast
            text="努力加载中..."
            // isOpened={loading.effects['index/getWeather']}
            isOpened={loading.models['index']}
            status="loading"
            duration={0}
          />
        </View>
        <View className="content">
          <View className="user-info at-row at-row__align--center at-row__justify--center">
            <View className="user-info__avatar">
              <AtAvatar circle openData={{ type: 'userAvatarUrl' }} />
            </View>
            <View className="user-info__nickname">
              <OpenData type="userNickName" />
            </View>
          </View>
          {weather && (
            <View className="weather-info">
              <View className="weather-info__location">{`${
                weather.basic.parent_city
              } ${weather.basic.location}`}</View>
              <View className="weather-info__condTxt">
                {weather.now.cond_txt}
              </View>
              <View className="weather-info__condIcon">
                {weather.now.cond_code}
              </View>
              <View className="weather-info__tmp">{weather.now.tmp}</View>
            </View>
          )}
          {quote && (
            <View className="quote-info">
              <View className="quote-text">{quote.hitokoto}</View>
              <View className="quote-from">{quote.from}</View>
            </View>
          )}
        </View>
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
