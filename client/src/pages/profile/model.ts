import * as profileApi from './service';

// import Taro from '@tarojs/taro';
// import * as profileApi from './service';
export default {
  namespace: 'profile',
  state: {
    quotes: [],
    photos: [],
    totalQuotePage: 1,
    totalPhotoPage: 1
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
          type: 'save',
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
    *getFondPhotos({ payload, success, fail }, { call, put, select }) {
      const { error, result } = yield call(profileApi.getFondPhotos, {
        ...payload
      });
      console.log('返回收藏的Photos', result);

      if (!error && result) {
        let data;
        if (result.pageIndex === 1) {
          data = result.data;
        } else {
          const prePhotos = yield select(state => state.profile.photos);
          data = prePhotos.concat(result.data);
        }

        yield put({
          type: 'save',
          payload: {
            photos: data,
            totalPhotoPage: result.totalPage
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
    },
    *upsertFondPhoto({ payload, success, fail }, { call, put }) {
      const { error, result } = yield call(profileApi.upsertFondPhoto, {
        ...payload
      });
      if (!error && result.result.stats.removed > 0) {
        yield success();
        yield put({
          type: 'syncPhotos',
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
    save(state, { payload }) {
      return { ...state, ...payload };
    },
    syncQuotes(state, { payload }) {
      const quotes = state.quotes;
      return {
        ...state,
        quotes: quotes.filter(item => item.id !== payload.quote.id)
      };
    },
    syncPhotos(state, { payload }) {
      const photos = state.photos;
      return {
        ...state,
        photos: photos.filter(item => item.pid !== payload.pid)
      };
    }
  }
};
