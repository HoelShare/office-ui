<template>
  <div class="building-list">
    <Panel>
      <div v-for="building in list" :key="building.id">
        <BuildingListItem :building="building" />
      </div>
      <template v-if="list.length === 0">
        Currently no Buildings.
      </template>
    </Panel>
    <BuildingCreate />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import BuildingListItem from '@/components/Admin/Building/ListItem.vue';
import BuildingCreate from '@/components/Admin/Building/Create.vue';
import Panel from '@/components/Panel.vue';
import { mapActions, mapState } from 'vuex';
import { Building, NAMES as entity } from '@/interfaces/Entity';
import { types } from '@/store/entity-api';

@Component({
  components: {
    Panel,
    BuildingCreate,
    BuildingListItem,
  },
  methods: mapActions(entity.building, {
    createBuilding: types.CREATE,
    fetchList: types.FETCH_LIST,
  }),
  computed: mapState(entity.building, ['list']),
})
export default class BuildingList extends Vue {
  private list!: Array<Building>;

  private fetchList!: () => Promise<Array<Building>>;

  mounted() {
    this.fetchList();
  }
}
</script>

<style scoped lang='scss'>
</style>
