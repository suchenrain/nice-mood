import Api from '@/utils/httpRequest';
import Taro from '@tarojs/taro';
import { getDateString } from '@/utils/common';
import { IPhoto } from '@/types';

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
 */
export const getDailyPhoto = async () => {
  const db = Taro.cloud.database();
  let dailyPhotoCol = db.collection('dailyPhoto');
  const datestr = getDateString();
  return await dailyPhotoCol
    .doc(datestr)
    .get()
    .then((photo: IPhoto) => {
      return { result: photo };
    })
    .catch(error => {
      return { error };
    });
};
/**
 * 获取问候语信息
 */
export const getGreeting = async () => {
  const hour = new Date().getHours();
  const key = `greeting_${hour}`;
  return await Taro.getStorage({
    key: key
  })
    .then(res => {
      const greetings = JSON.parse(res.data);
      return { result: greetings };
    })
    .catch(err => {
      return Taro.cloud
        .callFunction({
          name: 'getGreeting',
          data: {
            hour: hour
          }
        })
        .then((res: any) => {
          const greetings = res.result.data;
          Taro.setStorageSync(key, JSON.stringify(greetings));
          return { result: greetings };
        })
        .catch(error => {
          return { error };
        });
    });
};
