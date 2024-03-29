import Api from '@/utils/httpRequest';
import Taro from '@tarojs/taro';
import { getDateString } from '@/utils/common';

let cachedPhotos: any[] = [];
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

const randomPhoto = () => {
  let photo = cachedPhotos[Math.floor(Math.random() * cachedPhotos.length)];
  return Taro.cloud
    .getTempFileURL({
      fileList: [photo.fileID]
    })
    .then(res => {
      photo.tempFileURL = res.fileList[0].tempFileURL;
      //缓存图片到本地
      return Taro.getImageInfo({
        src: photo.tempFileURL
      })
        .then(localImage => {
          // 本地缓存路径
          photo.localPath = localImage.path;
          return { result: photo };
        })
        .catch(error => {
          return { error };
        });
    })
    .catch(error => {
      return { error };
    });
};
/**
 * 获取随机图片集
 */
export const getRandomPhotos = async () => {
  if (cachedPhotos.length > 0) {
    return randomPhoto();
  } else {
    return await Taro.cloud
      .callFunction({
        name: 'getRandomPhotos'
      })
      .then((res: any) => {
        cachedPhotos = res.result.list;
        return randomPhoto();
      })
      .catch(error => {
        return { error };
      });
  }
};
/**
 * 获取每日图片
 */
export const getDailyPhoto = async () => {
  const db = Taro.cloud.database();
  let dailyPhotoCol = db.collection('dailyPhoto');
  const datestr = getDateString();
  return await dailyPhotoCol
    .where({
      id: datestr
    })
    .limit(1)
    .get()
    .then(res => {
      let photo = res.data[0];
      return Taro.cloud
        .getTempFileURL({
          fileList: [photo.fileID]
        })
        .then(res => {
          //缓存图片到本地
          return Taro.getImageInfo({
            src: res.fileList[0].tempFileURL
          })
            .then(localImage => {
              // 本地缓存路径
              photo.localPath = localImage.path;
              return { result: photo };
            })
            .catch(error => {
              return { error };
            });
        })
        .catch(error => {
          return { error };
        });
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
      const greetings = res.data;
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
          Taro.setStorageSync(key, greetings);
          return { result: greetings };
        })
        .catch(error => {
          return { error };
        });
    });
};

/**
 * 添加/移除 喜欢的quote记录
 * @param payload {quote:{},fond:boolean}
 */
export const upsertFondQuote = async payload => {
  return await Taro.cloud
    .callFunction({
      name: 'upsertFondQuote',
      data: payload
    })
    .then(result => {
      return { result };
    })
    .catch(error => {
      return { error };
    });
};
/**
 * 添加/移除 喜欢的photo记录
 * @param payload {pid:'dM76dd',fond:boolean}
 */
export const upsertFondPhoto = async payload => {
  return await Taro.cloud
    .callFunction({
      name: 'upsertFondPhoto',
      data: payload
    })
    .then(result => {
      return { result };
    })
    .catch(error => {
      return { error };
    });
};
