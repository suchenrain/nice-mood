import Taro from '@tarojs/taro';

const easeInOut = (opacity: number, delay: number, duration: number) => {
  let animation = Taro.createAnimation({
    duration: duration,
    timingFunction: 'ease',
    delay: delay
  });
  animation.opacity(opacity).step();
  return animation.export();
};

const easeOutIn = (delay: number, duration: number) => {
  let animation = Taro.createAnimation({
    duration: duration,
    timingFunction: 'ease',
    delay: delay
  });
  animation.opacity(0).step();
  animation.opacity(1).step();
  return animation.export();
};

export { easeInOut, easeOutIn };
