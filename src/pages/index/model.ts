// import Taro from '@tarojs/taro';
import * as indexApi from './service';

export default {
  namespace: 'index',
  state: {
    weather: undefined,
    v: '1.0'
  },

  effects: {
    *getWeather({ payload }, { select, call, put }) {
      const { error, HeWeather6: result } = yield call(indexApi.getWeather, {
        ...payload
      });
      console.log('数据接口返回', result);
      if (!error) {
        yield put({
          type: 'save',
          payload: {
            weather: result[0]
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
