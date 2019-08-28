import Api from '@/utils/httpRequest';
import Taro from '@tarojs/taro';
import { getDateString } from '@/utils/common';
import { IPhoto } from '@/types/photo';

const db = Taro.cloud.database();

/**
 * 获取天气数据（和风天气）
 * @param data 请求参数
 */
export const getWeather = data => {
  return Api.getWeather(data);
};

/**
 * 获取随机一言
 * @param data 请求参数
 */
export const getQuote = data => {
  return Api.getQuote(data);
};

/**
 * 获取每日图片
 * @param data
 */
export const getDailyPhoto = () => {
  let dailyPhotoCol = db.collection('dailyPhoto');
  const datestr = getDateString();
  dailyPhotoCol.doc(datestr).get({
    success: (photo: IPhoto) => {
      return { result: photo };
    },
    fail: err => {
      return { err };
    }
  });
};
