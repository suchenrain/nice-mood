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
    *getFondQuotes({ payload, success, fail }, { call, put, select }) {
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
        if (success && typeof success === 'function') {
          yield success();
        }
      } else {
        if (fail && typeof fail === 'function') {
          yield fail();
        }
      }
    },
    *upsertFondQuote({ payload, success, fail }, { call, put }) {
      const { error, result } = yield call(profileApi.upsertFondQuote, {
        ...payload
      });
      if (!error && result.result.stats.removed > 0) {
        yield success();
        yield put({
          type: 'syncQuotes',
          payload
        });
      } else {
        if (fail && typeof fail === 'function') {
          yield fail(error);
        }
      }
    }
  },

  reducers: {
    saveQuotes(state, { payload }) {
      return { ...state, ...payload };
    },
    syncQuotes(state, { payload }) {
      const quotes = state.quotes;
      return {
        ...state,
        quotes: quotes.filter(item => item.id !== payload.quote.id)
      };
    }
  }
};
