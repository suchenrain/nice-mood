import Taro from '@tarojs/taro';

/**
 * 获取喜欢的quote列表
 */
export const getFondQuotes = async (
  pageIndex: number = 0,
  pageSize: number = 20
) => {
  return await Taro.cloud
    .callFunction({
      name: 'getFondQuotes',
      data: {
        pageIndex,
        pageSize
      }
    })
    .then((res: any) => {
      return { result: res.data };
    })
    .catch(error => {
      return { error };
    });
};
