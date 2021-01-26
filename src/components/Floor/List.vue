<template>
  <div class="floor-list">
    <template v-if="!building"> No building selected </template>
    <template v-else>
      <div v-for="floor in list" :key="floor.id">
        <FloorListItem class="mb-2" :floor="floor" @deleted="fetch" />
      </div>
      <template v-if="list.length === 0"> Currently no Floors. </template>
      <FloorCreate @created="fetch" v-if="isAdmin" />
    </template>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import FloorListItem from '@/components/Floor/ListItem.vue';
import FloorCreate from '@/components/Floor/Create.vue';
import Panel from '@/components/Panel.vue';
import { mapActions, mapGetters } from 'vuex';
import { Building, Floor, NAMES as entity } from '@/interfaces/Entity';
import { types } from '@/store/entity-api';

@Component({
  components: {
    Panel,
    FloorCreate,
    FloorListItem,
  },
  methods: mapActions(entity.floor, {
    createBuilding: types.CREATE,
    fetchList: types.FETCH_LIST,
  }),
  computed: mapGetters(['isAdmin']),
})
export default class FLoorList extends Vue {
  private list: Array<Floor> = [];

  private isAdmin!: boolean;

  @Prop({ required: true }) private building!: undefined | Building;

  private fetchList!: (filter: object | undefined) => Promise<Array<Floor>>;

  private get floorFilter(): object | undefined {
    if (!this.building) {
      return undefined;
    }

    return { where: { building: this.building.id } };
  }

  @Watch('building', { immediate: true })
  private async fetch(): Promise<void> {
    this.list = await this.fetchList(this.floorFilter);
  }
}
</script>

<style scoped lang='scss'>
</style>
