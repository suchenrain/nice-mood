import Api from '@/utils/httpRequest';
import Taro from '@tarojs/taro';
import { getDateString } from '@/utils/common';
import { IPhoto } from '@/types';

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
 */
export const getDailyPhoto = () => {
  let dailyPhotoCol = db.collection('dailyPhoto');
  const datestr = getDateString();
  dailyPhotoCol.doc(datestr).get({
    success: (photo: IPhoto) => {
      return { result: photo };
    },
    fail: error => {
      return { error };
    }
  });
};

/**
 * 获取问候语信息
 */
export const getGreeting = () => {
  const hour = new Date().getHours();
  const key = `greeting_${hour}`;
  Taro.getStorage({
    key: key
  })
    .then(res => {
      const greetings = JSON.parse(res.data);
      return { result: greetings };
    })
    .catch(err => {
      Taro.cloud
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
