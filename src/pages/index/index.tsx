import Taro, { Component, Config } from '@tarojs/taro';
import { View, OpenData } from '@tarojs/components';
import { connect } from '@tarojs/redux';
// import Api from '@/utils/httpRequest'
// import Tips from '@/utils/tips'
import { IndexProps, IndexState } from './index.interface';
import './index.scss';
import { AtButton, AtAvatar } from 'taro-ui';
import Tips from '@/utils/tips';
// import { Demo } from '@/components'
@connect(({ index }) => ({
  ...index
}))
class Index extends Component<IndexProps, IndexState> {
  config: Config = {
    navigationBarTitleText: '页面标题'
  };
  constructor(props: IndexProps) {
    super(props);
    this.state = {
      showOpenSetting: false
    };
  }
  componentWillMount() {
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
  }
  componentDidMount() {
    this.getList();
  }

  // 用户同意地理位置授权
  _locationAccept = () => {
    this._getUserLocationInfo();
  };
  // 用户拒绝地理位置授权
  _locationReject = () => {
    Taro.showModal({
      title: '提示',
      content: '您已关闭地理位置授权，建议开启以提升体验哦！',
      cancelText: '忽略',
      cancelColor: '#FF4949',
      confirmText: '去开启',
      success: res => {
        if (res.confirm) {
          this.setState({
            showOpenSetting: true
          });
        } else if (res.cancel) {
          this.setState({
            showOpenSetting: false
          });
        }
      }
    });
  };

  // 获取用户地理位置信息
  _getUserLocationInfo = () => {
    Taro.getLocation({
      type: 'wgs84',
      success(res) {
        const latitude = res.latitude;
        const longitude = res.longitude;
        Tips.toast(`您的经纬度: (${latitude},${longitude})`);
      }
    });
  };
  // 获取新闻列表
  async getList() {
    await this.props.dispatch({
      type: 'index/getList',
      payload: {}
    });
  }
  render() {
    const { data } = this.props;
    const { showOpenSetting } = this.state;
    console.log('this.props===>>', data);
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
        {showOpenSetting && (
          <View className="at-row at-row__justify--center">
            <View className="at-col at-col-8">
              <AtButton type="primary" openType="openSetting">
                打开设置页
              </AtButton>
            </View>
          </View>
        )}
        <View className="index-topbar">New资讯</View>
        <View className="index-data">
          {data &&
            data.map((item, index) => {
              return (
                <View className="index-list" key={index}>
                  <View className="index-title">{item.title}</View>
                  <View
                    className="index-img"
                    style={`background-image: url(${item.thumbnail_pic_s})`}
                  />
                </View>
              );
            })}
        </View>
      </View>
    );
  }
}
export default Index;
