// import Taro from '@tarojs/taro';
import * as homeApi from './service';
import { IQuote, IPhoto } from '@/types';
import defaultBg from '@/assets/bg/bg_dog.jpg';

const defaultQuote: IQuote = {
  id: 0,
  hitokoto: '世界很美，你也是。',
  from: 'Nice Mood'
};
const defaultPhoto: IPhoto = {
  _id: '',
  author: 'Nice Mood',
  datestr: '',
  fileID: '',
  pid: '',
  profile: '',
  url: '',
  localPath: defaultBg
};

export default {
  namespace: 'home',
  state: {
    weather: null,
    dailyPhoto: defaultPhoto,
    quote: defaultQuote,
    greetings: [],
    v: '1.0'
  },

  effects: {
    *getWeather({ payload, callback }, { call, put }) {
      const { error, result } = yield call(homeApi.getWeather, {
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
    *getDailyPhoto({ call, put }) {
      const { error, result } = yield call(homeApi.getDailyPhoto);
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
    *getGreeting({ call, put }) {
      const { error, result } = yield call(homeApi.getGreeting);
      console.log('返回Greeting', result);
      if (!error) {
        yield put({
          type: 'save',
          payload: {
            greetings: result
          }
        });
      }
    },
    *getQuote({ payload, callback }, { call, put }) {
      const { error, result } = yield call(homeApi.getQuote, {
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
