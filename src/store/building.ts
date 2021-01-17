import { Building } from '@/interfaces/Building';
import { AxiosInstance } from 'axios';
import { Commit, Dispatch } from 'vuex';
import * as types from './types';

export default {
  namespaced: true,
  state: {
    current: null as Building | null,
    list: [] as Array<Building>,
    isLoading: false,
  },
  mutations: {
    [types.CREATE](state: { list: Array<Building> }, building: Building) {
      state.list.push(building);
    },
    [types.SET_ALL](state: { list: Array<Building> }, buildings: Array<Building>) {
      state.list = buildings;
    },
    [types.MODIFY](state: { list: Array<Building> }, updated: Building) {
      const index = state.list.findIndex((building) => building.id === updated.id);
      state.list.splice(index, 1, updated);
    },
    [types.LOAD](state: { isLoading: boolean }, isLoading: boolean) {
      state.isLoading = isLoading;
    },
    [types.DELETE](state: { list: Array<Building> }, toDelete: Building | number) {
      const index = state.list.findIndex(
        (building) => building === toDelete || building.id === toDelete,
      );

      if (index === -1) {
        return;
      }

      state.list.splice(index, 1);
    },
  },
  actions: {
    [types.FETCH_LIST]({ state, rootState, commit }:
      {
        rootState: { axios: AxiosInstance };
        commit: Commit;
        state: { list: Array<Building> };
      }): Promise<Array<Building>> {
      if (state.list.length) {
        return new Promise((resolve) => resolve(state.list));
      }

      commit(types.LOAD, true);
      return rootState.axios.get('/api/building')
        .then((response) => response.data)
        .then((data) => data.building)
        .then((buildings: Array<Building>) => {
          buildings.forEach((building) => commit(types.CREATE, building));

          return buildings;
        })
        .finally(() => {
          commit(types.LOAD, false);

          return state.list;
        });
    },
    [types.CREATE]({ rootState, commit }:
      { rootState: { axios: AxiosInstance }; commit: Commit }, building: Building): Promise<void> {
      commit(types.LOAD, true);

      return rootState.axios.post('/api/building', building)
        .then((response) => response.data)
        .then((newCreated) => {
          commit(types.CREATE, newCreated);
        }).finally(() => commit(types.LOAD, false));
    },
    [types.DETAIL]({ rootState, commit }:
      {
        rootState: { axios: AxiosInstance };
        commit: Commit;
      }, buildingId: number): Promise<void> {
      commit(types.LOAD, true);

      return rootState.axios.get(`/api/building/${buildingId}`)
        .then((response) => response.data)
        .then((building) => {
          commit(types.MODIFY, building);
          return building;
        })
        .finally(() => commit(types.LOAD, false));
    },
    [types.MODIFY]({ rootState, commit, dispatch }:
      {
        rootState: { axios: AxiosInstance };
        commit: Commit;
        dispatch: Dispatch;
      }, building: Building): Promise<void> {
      console.log('Dispatch modify');

      if (!building.id) {
        return dispatch(types.CREATE, building);
      }

      commit(types.LOAD, true);

      return rootState.axios.patch(`/api/building/${building.id}`, building)
        .then((response) => response.data)
        .then((data) => commit(types.MODIFY, data))
        .finally(() => commit(types.LOAD, false));
    },
    [types.DELETE]({ rootState, commit }:
      {
        rootState: { axios: AxiosInstance };
        commit: Commit;
      }, buildingId: number): Promise<void> {
      commit(types.LOAD, true);

      return rootState.axios.delete(`/api/building/${buildingId}`)
        .then(() => commit(types.DELETE, buildingId))
        .finally(() => commit(types.LOAD, false));
    },
  },
};
