import * as profileApi from './service';

// import Taro from '@tarojs/taro';
// import * as profileApi from './service';
export default {
  namespace: 'profile',
  state: {
    quotes: []
  },

  effects: {
    *getFondQuotes({ payload }, { call, put, select }) {
      const { error, result } = yield call(profileApi.getFondQuotes, {
        ...payload
      });
      console.log('返回收藏的Quotes', result);
      if (!error) {
        const quotes = yield select(state => state.quotes);
        let newQuotes = quotes.concat(result);
        yield put({
          type: 'saveQuotes',
          payload: {
            quotes: newQuotes
          }
        });
      }
    }
  },

  reducers: {
    saveQuotes(state, { payload }) {
      return { ...state, ...payload.quotes };
    }
  }
};
