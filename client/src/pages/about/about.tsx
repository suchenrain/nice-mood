import Taro, { Component, Config } from '@tarojs/taro';
import { View, Swiper, SwiperItem, Image } from '@tarojs/components';

// import Tips from '@/utils/tips'
// import {  } from '@/components'
import { IAboutProps, IAboutState } from './about.interface';
import ad1 from '@/assets/images/ad1.jpg';
import ad2 from '@/assets/images/ad2.jpg';
import ad3 from '@/assets/images/ad3.jpg';

import './about.scss';

class About extends Component<IAboutProps, IAboutState> {
  config: Config = {
    navigationBarTitleText: '关于',
    navigationBarBackgroundColor: '#40a7e7',
    navigationBarTextStyle: 'white',
    navigationStyle: 'default'
  };

  ads = [
    {
      id: 1,
      alt: 'Nyanko',
      src: ad1
    },
    {
      id: 2,
      alt: 'Nice Mood',
      src: ad2
    },
    {
      id: 3,
      alt: 'Strawberry',
      src: ad3
    }
  ];
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

  previewAds = current => e => {
    e.stopPropagation();
    e.preventDefault();
    return;
    const urls = this.ads.map(p => {
      return `../..${p.src}`;
    });
    Taro.previewImage({
      urls,
      current: `../..${current}`
    });
  };
  render() {
    const repository = 'https://github.com/suchenrain/taro-ts-dva';
    const github = 'https://github.com/suchenrain';
    const email = '769118228@qq.com';
    const qq = '769118228';

    const swiperList = this.ads.map(ad => {
      return (
        <SwiperItem key={ad.id}>
          <View className="info" onClick={this.previewAds(ad.src)}>
            <Image className="image" src={ad.src} mode="aspectFill" />
            <View className="alt">{ad.alt}</View>
          </View>
        </SwiperItem>
      );
    });

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
          {swiperList}
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
            <View className="panel-content-icon iconfont icon-fasong" />
            <View className="panel-content-text">
              <View>灵感：Momentum</View>
            </View>
          </View>
          <View className="panel-content">
            <View className="panel-content-icon iconfont icon-cloud" />
            <View className="panel-content-text">
              <View>气象数据：和风天气</View>
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
              <View>图片：Unsplash</View>
            </View>
          </View>
        </View>
        <View className="footer">Copyright © 2019 suchenrain</View>
      </View>
    );
  }
}
export default About;
