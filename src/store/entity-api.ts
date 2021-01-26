import { AxiosInstance } from 'axios';
import { Commit, Dispatch } from 'vuex';

export const types = {
  FETCH_LIST: 'fetch_list',
  CREATE: 'create',
  MODIFY: 'modify',
  DELETE: 'delete',
  SET_ALL: 'setAll',
  LOAD: 'loading_state',
  DETAIL: 'detail',
  SET_CURRENT: 'set_current',
};

export default <S extends { id?: number | undefined }>(entityName: string) => ({
  namespaced: true,
  state: {
    current: null as S | null,
    list: [] as Array<S>,
    isLoading: false,
  },
  mutations: {
    [types.CREATE](state: { list: Array<S> }, newCreated: S) {
      const index = state.list.findIndex((item) => item.id === newCreated.id);
      if (index !== -1) {
        state.list.splice(index, 1, newCreated);
        return;
      }
      state.list.push(newCreated);
    },
    [types.SET_ALL](state: { list: Array<S> }, list: Array<S>) {
      state.list = list;
    },
    [types.MODIFY](state: { list: Array<S> }, updated: S) {
      const index = state.list.findIndex((item) => item.id === updated.id);
      state.list.splice(index, 1, updated);
    },
    [types.LOAD](state: { isLoading: boolean }, isLoading: boolean) {
      state.isLoading = isLoading;
    },
    [types.DELETE](state: { list: Array<S> }, toDelete: S | number) {
      const index = state.list.findIndex(
        (item) => item === toDelete || item.id === toDelete,
      );

      if (index === -1) {
        return;
      }

      state.list.splice(index, 1);
    },
    [types.SET_CURRENT](state: { current: S | null }, selected: S | null) {
      state.current = selected;
    },
  },
  actions: {
    async [types.FETCH_LIST]({ state, rootState, commit }:
      {
        rootState: { axios: AxiosInstance };
        commit: Commit;
        state: { list: Array<S> };
      }, filter?: object | undefined): Promise<Array<S>> {
      if (state.list.length && !filter) {
        return state.list;
      }

      commit(types.LOAD, true);
      try {
        return await rootState.axios.get(`/api/${entityName}`, { params: filter })
          .then((response) => response.data)
          .then((data) => data[entityName])
          .then((items: Array<S>) => {
            items.forEach((item) => commit(types.CREATE, item));

            return items;
          });
      } finally {
        commit(types.LOAD, false);
      }
    },
    async [types.CREATE]({ rootState, commit }:
      {
        rootState: { axios: AxiosInstance };
        commit: Commit;
      }, item: S): Promise<S | { error: object }> {
      commit(types.LOAD, true);

      try {
        return await rootState.axios.post(`/api/${entityName}`, item)
          .then((response) => response.data)
          .then((newCreated) => {
            commit(types.CREATE, newCreated);
            return newCreated;
          });
      } finally {
        commit(types.LOAD, false);
      }
    },
    async [types.DETAIL]({ rootState, commit }:
      {
        rootState: { axios: AxiosInstance };
        commit: Commit;
      }, id: number): Promise<S> {
      commit(types.LOAD, true);

      try {
        return await rootState.axios.get(`/api/${entityName}/${id}`)
          .then((response) => response.data)
          .then((item) => {
            commit(types.MODIFY, item);
            return item;
          });
      } finally {
        commit(types.LOAD, false);
      }
    },
    async [types.SET_CURRENT]({ dispatch, commit }:
      {
        dispatch: Dispatch;
        commit: Commit;
      }, id: number): Promise<S> {
      const response = await dispatch(types.DETAIL, id);
      commit(types.SET_CURRENT, response);
      return response;
    },
    async [types.MODIFY]({ rootState, commit, dispatch }:
      {
        rootState: { axios: AxiosInstance };
        commit: Commit;
        dispatch: Dispatch;
      }, item: S): Promise<S> {
      if (!item.id) {
        return dispatch(types.CREATE, item);
      }

      commit(types.LOAD, true);

      try {
        return await rootState.axios.patch(`/api/${entityName}/${item.id}`, item)
          .then((response) => response.data)
          .then((data) => {
            commit(types.MODIFY, data);

            return data;
          });
      } finally {
        commit(types.LOAD, false);
      }
    },
    [types.DELETE]({ rootState, commit }:
      {
        rootState: { axios: AxiosInstance };
        commit: Commit;
      }, id: number): Promise<void> {
      commit(types.LOAD, true);
      return rootState.axios.delete(`/api/${entityName}/${id}`)
        .then(() => commit(types.DELETE, id))
        .finally(() => commit(types.LOAD, false));
    },
  },
});
