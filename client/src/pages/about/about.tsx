import Taro, { Component, Config } from '@tarojs/taro';
import { View, Swiper, SwiperItem, Image } from '@tarojs/components';

// import Tips from '@/utils/tips'
// import {  } from '@/components'
import { IAboutProps, IAboutState } from './about.interface';
import photo1 from '@/assets/images/ad1.jpg';

import './about.scss';

class About extends Component<IAboutProps, IAboutState> {
  config: Config = {
    navigationBarTitleText: '关于',
    navigationBarBackgroundColor: '#40a7e7',
    navigationBarTextStyle: 'white',
    navigationStyle: 'default'
  };
  constructor(props: IAboutProps) {
    super(props);
    this.state = {};
  }
  componentDidMount() {}

  copy = (title: string, url: string) => e => {
    Taro.setClipboardData({
      data: url
    }).then(() => {
      Taro.showToast({
        title: `已复制${title}`,
        duration: 2000
      });
    });
  };
  render() {
    const repository = 'https://github.com/suchenrain/taro-ts-dva';
    const github = 'https://github.com/suchenrain';
    const email = '769118228@qq.com';
    const qq = '769118228';

    return (
      <View className="fx-about">
        <Swiper
          className="fx-about-swiper"
          indicator-color="#666666"
          indicator-active-color="#40a7e7"
          indicator-dots
          autoplay
          circular
          previous-margin="0px"
          next-margin="0px"
        >
          <SwiperItem>
            <View className="info">
              <Image className="image" src={photo1} mode="aspectFill" />
              <View className="alt">Nice Mood</View>
            </View>
          </SwiperItem>
          <SwiperItem>
            <View className="info">
              <Image className="image" src={photo1} mode="aspectFill" />
              <View className="alt">Nice Mood</View>
            </View>
          </SwiperItem>
        </Swiper>
        <View className="panel">
          <View className="panel-title">项目地址</View>
          <View
            className="panel-content"
            onClick={this.copy('项目地址', repository)}
          >
            <View className="panel-content-icon iconfont icon-github" />
            <View className="panel-content-text">
              <View>欢迎Star和PR</View>
              <View>{repository}</View>
            </View>
          </View>
        </View>
        <View className="panel">
          <View className="panel-title">联系反馈</View>
          <View className="panel-content" onClick={this.copy('GitHub', github)}>
            <View className="panel-content-icon iconfont icon-github-smile" />
            <View className="panel-content-text">
              <View>通过 GitHub 反馈</View>
              <View>{github}</View>
            </View>
          </View>
          <View className="panel-content" onClick={this.copy('Email', email)}>
            <View className="panel-content-icon iconfont icon-email" />
            <View className="panel-content-text">
              <View>通过 Email 反馈</View>
              <View>{email}</View>
            </View>
          </View>
          <View className="panel-content" onClick={this.copy('QQ', qq)}>
            <View className="panel-content-icon iconfont icon-qq" />
            <View className="panel-content-text">
              <View>通过 QQ 反馈</View>
              <View>{qq}</View>
            </View>
          </View>
        </View>
        <View className="panel">
          <View className="panel-title">感谢</View>
          <View className="panel-content">
            <View className="panel-content-icon iconfont icon-cloud" />
            <View className="panel-content-text">
              <View>气象数据源：和风天气</View>
            </View>
          </View>
          <View className="panel-content">
            <View className="panel-content-icon iconfont icon-textsms" />
            <View className="panel-content-text">
              <View>随机一言：一言(Hitokoto)</View>
            </View>
          </View>
          <View className="panel-content">
            <View className="panel-content-icon iconfont icon-camera" />
            <View className="panel-content-text">
              <View>图片来源：Unsplash</View>
            </View>
          </View>
        </View>
        <View className="footer">Copyright © 2019 suchenrain</View>
      </View>
    );
  }
}
export default About;
