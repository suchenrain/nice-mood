import Taro from '@tarojs/taro';

/*
|--------------------------------------
|  公用函数
|--------------------------------------
*/

export const repeat = (str = '0', times: number) =>
  new Array(times + 1).join(str);

// 时间前面 +0
export const pad = (num: number, maxLength = 2) =>
  repeat('0', maxLength - num.toString().length) + num;

//白天还是黑夜
export const isNight = () => {
  let time = new Date();
  const hour = time.getHours();
  if (hour >= 6 && hour <= 18) return false;
  else return true;
};
/**
 * 全局的公共变量
 */
export let globalData: any = {
  weatherKey: 'YOUR HEFENGTIANQI KEY',
  // xztqKey: '',
  unsplashClientId: 'YOUR UNSPLASH CLIENT ID'
};

export const setGlobalData = (key, val) => {
  globalData[key] = val;
};
export const getGlobalData = key => {
  return {...globalData[key]};
};

/**
 * 时间格式装换函数
 */
export const formatTime = (time: Date) => {
  `${pad(time.getHours())}:${pad(time.getMinutes())}:${pad(
    time.getSeconds()
  )}.${pad(time.getMilliseconds(), 3)}`;
};

/**
 * 获取当前年月日格式字符串
 */
export const getDateString = () => {
  const date = new Date();
  return `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(
    date.getDate()
  )}`;
};

/**
 * 获取当前页url
 */
export const getCurrentPageUrl = (): string => {
  let pages = Taro.getCurrentPages();
  let currentPage = pages[pages.length - 1];
  let url = currentPage.route;
  return url;
};

function createRpx2px() {
  const { windowWidth } = Taro.getSystemInfoSync();
  return (rpx: number) => {
    return (windowWidth / 750) * rpx;
  };
}

export const Rpx2px = createRpx2px();

/**
 * 获取字符串长度，区分中英文
 * @param str
 */
export const getStrLength = (str: string): number => {
  let cArr = str.match(/[^\x00-\xff]/gi);
  return str.length + (cArr == null ? 0 : cArr.length);
};
