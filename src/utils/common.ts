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
