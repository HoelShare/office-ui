<template>
  <div class="home">
    <Panel>
      <template #header>
        <div class="row mb-2">
          <div class="col-md-4 col-sm-12">Select Building</div>
          <div class="col-md-8 col-sm-12">
            <SelectField
              entity="building"
              :value="(selectedBuilding || {}).id"
              @input="selectBuilding"
            />
          </div>
        </div>
        <div class="row mb-2">
          <div class="col-md-4 col-sm-12">Select Floor</div>
          <div class="col-md-8 col-sm-12">
            <SelectField
              entity="floor"
              :filter="floorFilter"
              :value="(selectedFloor || {}).id"
              @input="selectFloor"
            />
          </div>
        </div>
      </template>
      <SeatMap :floor="selectedFloor" :seats="seats" />
    </Panel>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { mapActions, mapGetters, mapState } from 'vuex';
import SelectField from '@/components/SelectField.vue';
import Panel from '@/components/Panel.vue';
import SeatMap from '@/components/SeatMap.vue';
import { Building, Floor, NAMES as entity, Seat } from '@/interfaces/Entity';
import { types } from '@/store/entity-api';
import FloorList from '@/components/Admin/Floor/List.vue';

@Component({
  components: {
    SelectField,
    Panel,
    FloorList,
    SeatMap,
  },
  computed: {
    ...mapGetters(['isAdmin']),
    ...mapState(entity.building, {
      selectedBuilding: 'current',
    }),
    ...mapState(entity.floor, {
      selectedFloor: 'current',
    }),
  },
  methods: {
    ...mapActions(entity.building, {
      selectBuilding: types.SET_CURRENT,
    }),
    ...mapActions(entity.floor, {
      selectFloor: types.SET_CURRENT,
    }),
    ...mapActions(entity.seat, {
      fetchSeats: types.FETCH_LIST,
    }),
  },
})
export default class HomeView extends Vue {
  private isAdmin!: boolean;

  private selectedBuilding!: Building | null;

  private selectBuilding!: (id: number) => Promise<Building>;

  private selectedFloor!: Floor | null;

  private selectFloor!: (id: number) => Promise<Floor>;

  private fetchSeats!: (filter?: object) => Promise<Array<Seat>>;

  private seats: Array<Seat> = [];

  @Watch('selectedFloor', { immediate: true })
  private async updateSeats() {
    if (!this.selectedFloor) {
      return;
    }

    this.seats = await this.fetchSeats(this.seatFilter);
  }

  private get floorFilter() {
    if (!this.selectedBuilding) {
      return undefined;
    }

    return { where: { building: this.selectedBuilding.id } };
  }

  private get seatFilter() {
    if (!this.selectedFloor) {
      return undefined;
    }

    return { where: { floor: this.selectedFloor.id }, limit: 100 };
  }
}
</script>
