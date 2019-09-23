import * as profileApi from './service';

// import Taro from '@tarojs/taro';
// import * as profileApi from './service';
export default {
  namespace: 'profile',
  state: {
    quotes: [],
    photos: [],
    nomorePhoto: false,
    nomoreQuote: false
  },

  effects: {
    *getFondQuotes({ payload, success, fail }, { call, put, select }) {
      const { error, result } = yield call(profileApi.getFondQuotes, {
        ...payload
      });
      console.log('返回收藏的Quotes', result);

      if (!error && result) {
        let data;
        if (payload.isFirst) {
          const newData = result.data.map(item => {
            item.isNew = true;
            item.removed = false;
            return item;
          });
          data = newData;
        } else {
          const preQuotes = yield select(state => state.profile.quotes);
          const temp = preQuotes.filter(p => !p.removed);
          const newData = result.data.map(item => {
            item.isNew = true;
            item.removed = false;
            return item;
          });
          data = temp.concat(newData);
        }

        yield put({
          type: 'save',
          payload: {
            quotes: data,
            nomoreQuote: result.nomore
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
        if (payload.isFirst) {
          const newData = result.data.map(item => {
            item.isNew = true;
            item.removed = false;
            return item;
          });
          data = newData;
        } else {
          let prePhotos = yield select(state => state.profile.photos);
          const temp = prePhotos.filter(p => !p.removed);
          const newData = result.data.map(item => {
            item.isNew = true;
            item.removed = false;
            return item;
          });
          data = temp.concat(newData);
        }

        yield put({
          type: 'save',
          payload: {
            photos: data,
            nomorePhoto: result.nomore
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
        quotes: quotes.map(item => {
          if (item.id == payload.quote.id) {
            item.removed = true;
            item.isNew = false;
          }
          return item;
        })
      };
    },
    syncPhotos(state, { payload }) {
      const photos = state.photos;
      return {
        ...state,
        photos: photos.map(item => {
          if (item.pid == payload.pid) {
            item.removed = true;
            item.isNew = false;
          }
          return item;
        })
      };
    }
  }
};
