import Taro, { Component, Config } from '@tarojs/taro';
import { View, OpenData } from '@tarojs/components';
import { connect } from '@tarojs/redux';
// import Api from '@/utils/httpRequest'
// import Tips from '@/utils/tips'
import { IndexProps, IndexState } from './index.interface';
import './index.scss';
import { AtAvatar } from 'taro-ui';
import Tips from '@/utils/tips';
import { OpenSetting } from '@/components';
import { globalData } from '@/utils/common';
// import { Demo } from '@/components'
@connect(({ index }) => ({
  ...index
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
      located: false
    };
  }
  // 对应微信小程序 onLoad()
  componentDidMount() {
    this._reloadPage();
  }
  // 对应微信小程序的onShow()
  componentDidShow() {}

  _askLocationAuthorize = () => {
    Taro.getSetting({
      success: res => {
        // 从未授权地理位置或者已经拒绝
        if (!res.authSetting['scope.userLocation']) {
          Taro.authorize({ scope: 'scope.userLocation' }).then(
            this._locationAccept,
            this._locationReject
          );
        } else {
          // 已授权过
          this._getUserLocationInfo();
        }
      }
    });
  };


  // 用户同意地理位置授权
  _locationAccept = () => {
    this._getUserLocationInfo();
  };
  // 用户拒绝地理位置授权
  _locationReject = () => {
    this.setState({
      showOpenSetting: true
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
        Tips.toast(`您的经纬度: (${latitude},${longitude})`);
        this._getWeather(`${latitude},${longitude}`);
      }
    });
  };

  _getWeather = async (location: string) => {
    await this.props.dispatch({
      type: 'index/getWeather',
      payload: { location, key: globalData.weatherKey }
    });
  };

  onHideOpenSetting = () => {
    this.setState({
      showOpenSetting: false
    });
  };
  onPullDownRefresh = () => {
    Tips.toast('下拉刷新');
    Taro.stopPullDownRefresh();
  };
  // （重）加载页面数据
  _reloadPage = () => {
    
  };

  render() {
    const { weather } = this.props;
    const { showOpenSetting } = this.state;
    return (
      <View className="fx-index-wrap">
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
