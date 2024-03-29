import Taro from '@tarojs/taro';

/**
 * 获取喜欢的quote列表
 */
export const getFondQuotes = async payload => {
  const timeLine: string = payload.isFirst ? '' : payload.timeLine;
  const pageSize: number = payload.pageSize || 50;
  return await Taro.cloud
    .callFunction({
      name: 'getFondQuotes',
      data: {
        timeLine,
        pageSize
      }
    })
    .then((res: any) => {
      return { result: res.result };
    })
    .catch(error => {
      return { error };
    });
};
/**
 * 获取喜欢的图片列表
 */
export const getFondPhotos = async payload => {
  const timeLine: string = payload.isFirst ? '' : payload.timeLine;
  const pageSize: number = payload.pageSize || 5;
  return await Taro.cloud
    .callFunction({
      name: 'getFondPhotos',
      data: {
        timeLine,
        pageSize
      }
    })
    .then((res: any) => {
      return { result: res.result };
    })
    .catch(error => {
      return { error };
    });
};

/**
 * 移除 喜欢的quote记录
 * @param payload {quote:{id},fond:fasle}
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
 * 移除 喜欢的photo记录
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
