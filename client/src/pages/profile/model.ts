import * as profileApi from './service';

// import Taro from '@tarojs/taro';
// import * as profileApi from './service';
export default {
  namespace: 'profile',
  state: {
    quotes: [],
    totalQuotePage: 1
  },

  effects: {
    *getFondQuotes({ payload, callback }, { call, put, select }) {
      const { error, result } = yield call(profileApi.getFondQuotes, {
        ...payload
      });
      console.log('返回收藏的Quotes', result);

      if (!error && result) {
        let data;
        if (result.pageIndex === 1) {
          data = result.data;
        } else {
          const preQuotes = yield select(state => state.profile.quotes);
          data = preQuotes.concat(result.data);
        }

        yield put({
          type: 'saveQuotes',
          payload: {
            quotes: data,
            totalQuotePage: result.totalPage
          }
        });
        if (callback && typeof callback === 'function') {
          yield callback();
        }
      }
    }
  },

  reducers: {
    saveQuotes(state, { payload }) {
      return { ...state, ...payload };
    }
  }
};
