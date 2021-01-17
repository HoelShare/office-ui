<template>
  <div class="admin" v-if="isAdmin">
    Is Loading: {{ isLoading }}
    <ModifyBuilding />
    <div v-for="building in buildings" :key="building.id">
      {{ building.id }} - {{ building.name }}
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import ModifyBuilding from '@/components/Admin/Building.vue';
import { mapActions, mapGetters, mapState } from 'vuex';
import * as types from '@/store/types';
import { Building } from '@/interfaces/Building';

@Component({
  components: {
    ModifyBuilding,
  },
  methods: mapActions(types.ENTITY.BUILDING, {
    fetchBuildings: types.FETCH_LIST,
    createBuilding: types.CREATE,
    deleteBuilding: types.DELETE,
    modifyBuilding: types.MODIFY,
  }),
  computed: {
    ...mapGetters(['isAdmin']),
    ...mapState(types.ENTITY.BUILDING, {
      isLoading: 'isLoading',
      buildings: 'list',
    }),
  },
})
export default class AdminView extends Vue {
  private isAdmin!: boolean;

  private buildings!: Array<Building>;

  private isLoading!: boolean;

  private fetchBuildings!: () => Promise<Array<Building>>;

  private createBuilding!: (building: Building) => Promise<void>;

  private deleteBuilding!: (buildingId: number) => Promise<void>;

  private modifyBuilding!: (building: Building) => Promise<void>;

  mounted() {
    this.fetchBuildings();
  }
}
</script>
