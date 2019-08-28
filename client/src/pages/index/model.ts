// import Taro from '@tarojs/taro';
import * as indexApi from './service';

export default {
  namespace: 'index',
  state: {
    weather: undefined,
    dailyPhoto: undefined,
    quote: undefined,
    v: '1.0'
  },

  effects: {
    *getWeather({ payload, callback }, { call, put }) {
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
        if (callback && typeof callback === 'function') {
          yield callback();
        }
      }
    },
    *getDailyImage({ payload }, { call, put }) {
      const { error, result } = yield call(indexApi.getDailyPhoto, {
        ...payload
      });
      console.log('图片接口返回', result);
      if (!error) {
        yield put({
          type: 'save',
          payload: {
            dailyPhoto: result
          }
        });
      }
    },
    *getQuote({ payload, callback }, { call, put }) {
      const { error, result } = yield call(indexApi.getQuote, {
        ...payload
      });
      console.log('一言接口返回', result);
      if (!error) {
        yield put({
          type: 'save',
          payload: {
            quote: result
          }
        });
        if (callback && typeof callback === 'function') {
          yield callback();
        }
      }
    }
  },

  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    }
  }
};
