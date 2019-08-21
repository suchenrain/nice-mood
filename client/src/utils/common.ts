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
  weatherKey: 'd798190309e54c4a9b6ca1c311368f9a',
  xztqKey: 'SZifQZwj79AaYH8NL',
  unsplashClientId:
    'ebecebfa0d4192a48cbccdbcb1304b25c613a604456a223e93904c7ebadf2170'
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
 * 获取当前页url
 */
export const getCurrentPageUrl = (): string => {
  let pages = Taro.getCurrentPages();
  let currentPage = pages[pages.length - 1];
  let url = currentPage.route;
  return url;
};
