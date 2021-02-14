<template>
  <div class="home">
    <Panel>
      <template #header>
        <div class="row mb-2">
          <div class="col-lg-3 col-md-6 col-sm-12 mb-2">
            <SelectField
              entity="building"
              :value="(selectedBuilding || {}).id"
              @input="selectBuilding"
              label="Select Building"
            />
          </div>
          <div class="col-lg-3 col-md-6 col-sm-12 mb-2">
            <SelectField
              entity="floor"
              :filter="floorFilter"
              :value="(selectedFloor || {}).id"
              @input="selectFloor"
              label="Select Floor"
            />
          </div>
          <div class="col-lg-6 col-md-12 mb-2">
            <DatePicker
              :is-expanded="true"
              v-model="selectedDate"
              @input="checkBookings"
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
import { mapActions, mapState } from 'vuex';
import SelectField from '@/components/SelectField.vue';
import Panel from '@/components/Panel.vue';
import SeatMap from '@/components/SeatMap.vue';
import {
  Booking,
  Building,
  Floor,
  NAMES as entity,
  Seat,
} from '@/interfaces/Entity';
import { types } from '@/store/entity-api';
import FloorList from '@/components/Admin/Floor/List.vue';
import DatePicker from 'v-calendar/lib/components/date-picker.umd';

@Component({
  components: {
    SelectField,
    Panel,
    FloorList,
    SeatMap,
    DatePicker,
  },
  computed: {
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
    ...mapActions(entity.booking, {
      fetchBookings: types.FETCH_LIST,
    }),
  },
})
export default class HomeView extends Vue {
  private selectedBuilding!: Building | null;

  private selectBuilding!: (id: number) => Promise<Building>;

  private selectedFloor!: Floor | null;

  private selectFloor!: (id: number) => Promise<Floor>;

  private fetchSeats!: (filter?: object) => Promise<Array<Seat>>;

  private fetchBookings!: (filter?: object) => Promise<Array<Booking>>;

  private seats: Array<Seat> = [];

  private selectedDate: Date | null = new Date();

  private bookingsOnDay: Array<Booking> = [];

  @Watch('selectedFloor', { immediate: true })
  private async updateSeats() {
    if (!this.selectedFloor) {
      return;
    }

    this.seats = await this.fetchSeats(this.seatFilter);
  }

  private async checkBookings() {
    this.bookingsOnDay = await this.fetchBookings(this.bookingFilter);
  }

  private get bookingFilter() {
    if (!this.selectedDate) {
      return undefined;
    }

    const startDay = new Date(this.selectedDate);
    const endDay = new Date(this.selectedDate);

    startDay.setUTCHours(0, 0);
    endDay.setUTCHours(23, 59, 59, 99);

    return {
      where: {
        untilDay: { type: 'lte', value: endDay.toISOString() },
        fromDay: { type: 'gte', value: startDay.toISOString() },
        'seat.floorId': this.selectedFloor?.id,
      },
    };
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
