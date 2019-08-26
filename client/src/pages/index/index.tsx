import Taro, { Component, Config } from '@tarojs/taro';
import { View, Text, Image, OpenData, Button } from '@tarojs/components';
import { connect } from '@tarojs/redux';
// import Api from '@/utils/httpRequest'
// import Tips from '@/utils/tips'
import { IndexProps, IndexState } from './index.interface';
import {
  OpenSetting,
  Clock,
  Copyright,
  ActionPanel,
  ActionPanelItem,
  ShareMoment
} from '@/components';
import { globalData, isNight, getCurrentPageUrl, pad } from '@/utils/common';
import bgDog from '@/assets/bg/bg_dog.jpg';
import { show } from '@/utils/animation';

import classNames from 'classnames';

import './index.scss';
import { autoUpdate } from '@/utils/autoUpgrade';
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
  quoteTimeId: any;
  weatherTimeId: any;
  greetingTimeId: any;
  refreshingQuote: boolean = false;

  constructor(props: IndexProps) {
    super(props);
    this.state = {
      showOpenSetting: false,
      showActionPanel: false,
      shareMoment: false,
      // 是否已定位
      located: false,
      //背景图是否已加载完成
      dailyBg: '',
      bgLoaded: false,
      ani: {},
      greeting: 'You got it'
    };
  }

  componentWillMount() {
    autoUpdate();
  }
  // 对应微信小程序 onLoad()
  componentDidMount() {
    this._reloadPage();
    show(this, 'userAvatar', 0.7, 500, 2000);
    show(this, 'clock', 1, 500, 2000);
  }
  // 对应微信小程序的onShow()
  componentDidShow() {}

  onShareAppMessage = res => {
    const title = this.props.quote ? this.props.quote.hitokoto : '每天好心情呢';
    const imageUrl = this.state.bgLoaded
      ? 'https://source.unsplash.com/user/suchenrain/likes/500x400'
      : bgDog;
    const path = getCurrentPageUrl();
    return {
      title: title,
      path: path,
      imageUrl: imageUrl
    };
  };
  onHideOpenSetting = () => {
    Taro.vibrateShort();
    this.setState({
      showOpenSetting: false
    });
  };
  onPullDownRefresh = () => {
    Taro.stopPullDownRefresh();
    this._reloadPage();
    // const query = Taro.createSelectorQuery();
    // let test = query.select('.daily-image');
    // let test2 = query.select('.daily-image-default');
    // test
    //   .fields({ properties: ['src', 'mode'] }, res => {
    //     console.log(res);
    //   })
    //   .exec();
    // test2
    //   .fields({ properties: ['src', 'mode'] }, res => {
    //     console.log(res);
    //   })
    //   .exec();
  };

  onBgLoaded = (e: any) => {
    show(this, 'defaultBg', 0, 200, 2000);
    show(this, 'bg', 1, 200, 2000);

    this.setState({
      bgLoaded: true
    });
  };

  onRefresh = () => {
    this._getQuote();
    this._reloadGetGreeting();
  };
  handleCancelPanel = () => {
    this.setState({
      showActionPanel: false
    });
  };
  handleShare = () => {
    this.setState({ showActionPanel: true }, () => {
      Taro.vibrateShort();
    });
  };
  onCloseShareMoment = () => {
    this.setState({
      shareMoment: false,
      showActionPanel: true
    });
  };
  // 分享朋友圈
  onShareMoment = () => {
    this.handleCancelPanel();
    this.setState({ shareMoment: true });
  };
  //发送给朋友
  onForward = () => {
    this.handleCancelPanel();
  };

  // （重）加载页面数据
  _reloadPage = () => {
    this._setWeatherAndLocation();
    this._getQuote();
    this._reloadGetGreeting();
    this._setBackgroud();
  };

  /** 设置背景图片 */
  _setBackgroud = () => {
    if (!this.state.bgLoaded) {
      this._getDailyImage();
    }
  };
  _dailyBgName = () => {
    const date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();

    const fileName = `cloud://dev-nicemood.6465-dev-nicemood-1257746022/DailyPhoto/${year}${pad(
      month
    )}${pad(day)}.jpg`;
    return fileName;
  };
  _getDailyImage = () => {
    Taro.cloud
      .getTempFileURL({
        fileList: [this._dailyBgName()]
      })
      .then(res => {
        this.setState({
          dailyBg: res.fileList[0].tempFileURL
        });
      });
    // this.props.dispatch({
    //   type: 'index/getDailyImage',
    //   payload: {
    //     collections: `8349391,8349361`,
    //     client_id: globalData.unsplashClientId
    //   }
    // });
  };

  _getGreeting = cb => {
    Taro.cloud
      .callFunction({
        name: 'getGreeting',
        data: {
          hour: new Date().getHours()
        }
      })
      .then((res: any) => {
        let data = res.result.data;
        if (data) {
          cb && cb(data);
        }
      });
  };
  _reloadGetGreeting = () => {
    let hour = new Date().getHours();
    const key = `greeting_${hour}`;
    Taro.getStorage({
      key: key
    }).then(
      res => {
        const greetings = JSON.parse(res.data);
        this._setGreeting(greetings);
      },
      err => {
        this._getGreeting(msgs => {
          const greetings = msgs.map(msg => msg.message);
          this._setGreeting(greetings);
          Taro.setStorage({
            key: key,
            data: JSON.stringify(greetings)
          });
        });
      }
    );
  };
  _setGreeting = greetings => {
    if (this.greetingTimeId) clearTimeout(this.greetingTimeId);

    show(this, 'greeting', 0, 0.1, 3000);
    let greeting = greetings[Math.floor(Math.random() * greetings.length)];
    this.greetingTimeId = setTimeout(() => {
      this.setState({ greeting }, () => {
        show(this, 'greeting', 0.7, 0, 3000);
      });
    }, 3000);
  };

  _getQuote = () => {
    if (this.quoteTimeId) clearTimeout(this.quoteTimeId);
    this.refreshingQuote = true;
    show(this, 'quote', 0, 0, 1000);
    this.quoteTimeId = setTimeout(() => {
      this.props.dispatch({
        type: 'index/getQuote',
        payload: {
          c: 'g'
        },
        callback: () => {
          Taro.vibrateShort();
          this.refreshingQuote = false;
          show(this, 'quote', 1, 0, 2000);
        }
      });
    }, 1000);
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
        const permisson = 'scope.userLocation';
        // 从未授权地理位置或者已经拒绝
        if (!res.authSetting[permisson]) {
          Taro.vibrateShort();
          Taro.authorize({ scope: permisson }).then(() => {
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
    if (this.weatherTimeId) clearTimeout(this.weatherTimeId);
    show(this, 'weather', 0, 0, 1000);
    this.weatherTimeId = setTimeout(() => {
      Taro.vibrateShort();
      this.props.dispatch({
        type: 'index/getWeather',
        payload: { location, key: globalData.weatherKey },
        callback: () => {
          show(this, 'weather', 0.8, 0, 1500);
        }
      });
    }, 1000);
  };

  render() {
    const { weather, quote, loading } = this.props;
    const {
      showOpenSetting,
      showActionPanel,
      shareMoment,
      ani,
      greeting,
      dailyBg
    } = this.state;
    const hasNight =
      weather &&
      [100, 103, 104, 300, 301, 406, 407].indexOf(weather.now.cond_code) > -1;
    const weatherIconStyle = weather && {
      mask: `url(https://cdn.heweather.com/cond_icon/${
        weather.now.cond_code
      }.png) no-repeat`,
      '-webkit-mask': `url(https://cdn.heweather.com/cond_icon/${
        weather.now.cond_code
      }${isNight() && hasNight ? 'n' : ''}.png) no-repeat`,
      '-webkit-mask-size': '100% 100%',
      'mask-size': '100% 100%'
    };

    const refreshClass = classNames('iconfont', 'iconrefresh', {
      'iconrefresh--active': this.refreshingQuote
    });
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
            // src="https://source.unsplash.com/user/suchenrain/likes/600x960"
            src={dailyBg}
            mode="aspectFill"
            onLoad={this.onBgLoaded}
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
              <View className="greeting-text" animation={ani.greeting}>
                {greeting}
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
            <Text className={refreshClass} onClick={this.onRefresh} />
            <View className="iconfont iconshare" onClick={this.handleShare}>
              {/* <Button className="share-btn" size="mini" openType="share" /> */}
            </View>
          </View>
        </View>
        <Copyright />
        <OpenSetting
          isOpened={showOpenSetting}
          onCancel={this.onHideOpenSetting}
          onOk={this.onHideOpenSetting}
        />
        <ActionPanel
          cancelText="取消"
          isOpened={showActionPanel}
          className="action-panel-wrap"
          onCancel={this.handleCancelPanel}
          onClose={this.handleCancelPanel}
        >
          <ActionPanelItem
            onClick={this.onForward}
            icon="iconfasongtijiao"
            title="发送给朋友"
          >
            <Button className="share-btn" size="mini" openType="share" />
          </ActionPanelItem>
          <ActionPanelItem
            onClick={this.onShareMoment}
            icon="iconpengyouquan"
            title="分享到朋友圈"
          />
        </ActionPanel>
        <ShareMoment
          isOpened={shareMoment}
          onClose={this.onCloseShareMoment}
          src={dailyBg}
          text={quote ? quote.hitokoto : ''}
          author={quote ? quote.from : ''}
        />
      </View>
    );
  }
}
export default Index;
