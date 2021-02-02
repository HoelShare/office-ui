<template>
  <div class="seat-admin">
    <Panel>
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
      <div class="position-relative">
        <div class="w-100">
          <img
            v-if="selectedFloor && selectedFloor.floorPath"
            @click="addSeat"
            class="img-fluid"
            :src="`${baseUrl}/${selectedFloor.floorPath}`"
          />
          <div
            v-for="seat in seats"
            :key="seat.id"
            class="seat"
            :style="seatStyles(seat)"
            :class="seatClass(seat)"
          ></div>
        </div>
      </div>
    </Panel>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { mapActions, mapGetters, mapState } from 'vuex';
import SelectField from '@/components/SelectField.vue';
import Panel from '@/components/Panel.vue';
import { Building, Floor, NAMES as entity, Seat } from '@/interfaces/Entity';
import { types } from '@/store/entity-api';

@Component({
  components: {
    SelectField,
    Panel,
  },
  computed: {
    ...mapGetters(['isAdmin', 'baseUrl']),
    ...mapState(entity.building, {
      selectedBuilding: 'current',
    }),
    ...mapState(entity.floor, {
      selectedFloor: 'current',
    }),
    ...mapState(entity.seat, {
      seatsLoading: 'isLoading',
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
      createSeat: types.CREATE,
    }),
  },
})
export default class AdminSeatView extends Vue {
  private isAdmin!: boolean;

  private selectedBuilding!: Building | null;

  private selectBuilding!: (id: number) => Promise<Building>;

  private selectedFloor!: Floor | null;

  private selectFloor!: (id: number) => Promise<Floor>;

  private fetchSeats!: (filter?: object) => Promise<Array<Seat>>;

  private createSeat!: (seat: Seat) => Promise<void>;

  private baseUrl!: string | undefined;

  private seats: Array<Seat> = [];

  private seatClass(seat: Seat) {
    return {
      available: true,
      blocked: seat.number === 0,
    };
  }

  private seatStyles(seat: Seat) {
    return {
      left: `${seat.locationX}%`,
      top: `${seat.locationY}%`,
    };
  }

  private addSeat(e: MouseEvent) {
    const imageElement = e.target as HTMLImageElement;
    if (!imageElement) {
      return;
    }

    const x = ((e.offsetX - 10) * 100) / imageElement.width;
    const y = ((e.offsetY - 10) * 100) / imageElement.height;
    this.createSeat({
      locationX: x,
      locationY: y,
      floorId: this.selectedFloor?.id!,
      number: 0,
    }).then(this.updateSeats);
  }

  private get floorFilter() {
    if (!this.selectedBuilding) {
      return undefined;
    }

    return { where: { building: this.selectedBuilding?.id } };
  }

  private get seatFilter() {
    if (!this.selectedFloor) {
      return undefined;
    }
    return { where: { floor: this.selectedFloor.id }, limit: 100 };
  }

  @Watch('seatFilter')
  private async updateSeats() {
    console.log('Update seats');

    this.seats = await this.fetchSeats(this.seatFilter);
  }
}
</script>

<style lang="scss" scoped>
.seat-admin {
  .position-relative {
    background: hsla(0,0%,100%,.1);
    z-index: 1;
  }

  .img-fluid {
    width: 100%;
  }

  .seat {
    position: absolute;
    width: 20px;
    height: 20px;
    border-radius: 10px;
    transition: all 0.25s ease-in-out;
    border: 2px solid #fff;

    &.available {
      background-color: seagreen;
    }
  }
}
</style>
