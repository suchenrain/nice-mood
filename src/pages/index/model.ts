// import Taro from '@tarojs/taro';
import * as indexApi from './service';

export default {
  namespace: 'index',
  state: {
    weather: undefined,
    bgImage: undefined,
    v: '1.0'
  },

  effects: {
    *getWeather({ payload }, { select, call, put }) {
      const { error, result } = yield call(indexApi.getWeather, {
        ...payload
      });
      console.log('天气接口返回', result);
      if (!error) {
        yield put({
          type: 'save',
          payload: {
            weather: result.HeWeather6[0]
          }
        });
      }
    },
    *getDailyImage({ payload }, { call, put }) {
      const { error, result } = yield call(indexApi.getDailyImage, {
        ...payload
      });
      console.log('图片接口返回', result);
      if (!error) {
        yield put({
          type: 'save',
          payload: {
            bgImage: result
          }
        });
      }
    }
  },

  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    }
  }
};
