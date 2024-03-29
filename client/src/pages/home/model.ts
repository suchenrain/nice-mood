// import Taro from '@tarojs/taro';
import * as homeApi from './service';
import { IQuote, IPhoto } from '@/types';

const defaultQuote: IQuote = {
  id: 0,
  hitokoto: '世界很美，你也是。',
  from: 'Nice Mood',
  fondTime: ''
};
const defaultPhoto: IPhoto = {
  _id: '',
  author: 'Nice Mood',
  fileID: '',
  pid: '',
  profile: '',
  url: '',
  localPath: '',
  tempFileURL: '',
  color: '',
  alt: '',
  id: '',
  fondTime: ''
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
      const data = result.HeWeather6[0];
      if (!error && data.status == 'ok') {
        yield put({
          type: 'save',
          payload: {
            weather: data
          }
        });
      }
      if (callback && typeof callback === 'function') {
        yield callback(data.status);
      }
    },
    *getDailyPhoto({}, { call, put }) {
      const { error, result } = yield call(homeApi.getDailyPhoto, {});
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
    *getRandomPhotos({ success }, { call, put }) {
      const { error, result } = yield call(homeApi.getRandomPhotos, {});
      console.log('随机图片接口返回', result);
      if (!error && result) {
        yield put({
          type: 'save',
          payload: {
            dailyPhoto: result
          }
        });
        if (success && typeof success === 'function') {
          yield success();
        }
      }
    },
    *getGreeting({ callback }, { call, put }) {
      const { error, result } = yield call(homeApi.getGreeting, {});
      console.log('返回Greeting', result);
      if (!error) {
        yield put({
          type: 'save',
          payload: {
            greetings: result
          }
        });
        if (callback && typeof callback === 'function') {
          yield callback();
        }
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
    },
    *upsertFondQuote({ payload, callback }, { call }) {
      const { error, result } = yield call(homeApi.upsertFondQuote, {
        ...payload
      });
      if (callback && typeof callback === 'function') {
        yield callback(error, result);
      }
    },
    *upsertFondPhoto({ payload, callback }, { call }) {
      const { error, result } = yield call(homeApi.upsertFondPhoto, {
        ...payload
      });
      if (callback && typeof callback === 'function') {
        yield callback(error, result);
      }
    }
  },

  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    }
  }
};
