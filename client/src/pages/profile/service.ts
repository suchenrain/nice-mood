import Taro from '@tarojs/taro';

/**
 * 获取喜欢的quote列表
 */
export const getFondQuotes = async payload => {
  const pageIndex: number = payload.pageIndex || 1;
  const pageSize: number = payload.pageSize || 50;
  return await Taro.cloud
    .callFunction({
      name: 'getFondQuotes',
      data: {
        pageIndex,
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
