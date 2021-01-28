import { RootState } from '@/interfaces/States';
import { Commit } from 'vuex';
import { types } from './entity-api';

export const NAME = 'floorMap';

export default {
  namespaced: true,
  state: {
    isLoading: false,
    file: File,
  },
  mutations: {
    [types.CREATE](state: { file: File }, newCreated: File) {
      state.file = newCreated;
    },
    [types.LOAD](state: { isLoading: boolean }, isLoading: boolean) {
      state.isLoading = isLoading;
    },
  },
  actions: {
    [types.CREATE]({ rootState, commit }:
      {
        rootState: RootState; commit: Commit;
      }, { file, id }:
        { file: File; id: number }): Promise<void> {
      if (!rootState.axios) {
        return new Promise((resolve) => resolve());
      }

      commit(types.LOAD, true);
      const formData = new FormData();
      formData.append('file', file);

      return rootState.axios.post(`/api/floor/${id}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
        .then((response) => response.data)
        .then((newCreated) => {
          commit(types.CREATE, newCreated);
        }).finally(() => commit(types.LOAD, false));
    },
  },
};
