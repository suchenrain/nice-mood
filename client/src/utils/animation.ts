import Taro from '@tarojs/taro';
/**
 * 淡入或淡出
 * @param that 页面this
 * @param ele  动画名称
 * @param opacity 目标透明度
 * @param delay  动画延时
 * @param duration 动画持续时间
 */
const show = (
  that: any,
  ele: string,
  opacity: number,
  delay: number = 0,
  duration: number = 800
) => {
  const animation = Taro.createAnimation({
    duration: duration,
    timingFunction: 'linear',
    delay: delay
  });
  animation.opacity(opacity).step();
  that.setState(prevState => {
    return { ani: { ...prevState.ani, [ele]: animation.export() } };
  });
};

const fadeIn = (
  that: any,
  ele: string,
  delay: number = 0,
  duration: number = 800
) => {
  const animation = Taro.createAnimation({
    duration: duration,
    timingFunction: 'ease',
    delay: delay
  });
  animation.opacity(0.3).step();
  animation.opacity(1).step();
  that.setState(prevState => {
    return { ani: { ...prevState.ani, [ele]: animation.export() } };
  });
};

export { show, fadeIn };
