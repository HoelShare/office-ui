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
      <SeatMap
        @click="setSeatLocation"
        :floor="selectedFloor"
        :seats="seats"
        @selectSeat="newSeat = $event"
        @dropSeat="onDrop"
        @startDrag="startDrag"
      >
      </SeatMap>
      <SeatModal :seat="newSeat" @close="closeModal" />
    </Panel>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { mapActions, mapGetters, mapState } from 'vuex';
import SelectField from '@/components/SelectField.vue';
import Panel from '@/components/Panel.vue';
import SeatModal from '@/components/Admin/Seat/Modal.vue';
import SeatMap from '@/components/SeatMap.vue';
import TextField from '@/components/TextField.vue';
import Button from '@/components/Button.vue';
import { Building, Floor, NAMES as entity, Seat } from '@/interfaces/Entity';
import { types } from '@/store/entity-api';

@Component({
  components: {
    SelectField,
    Panel,
    SeatModal,
    SeatMap,
    TextField,
    Button,
  },
  computed: {
    ...mapGetters(['isAdmin']),
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
      modifySeat: types.MODIFY,
      deleteSeat: types.DELETE,
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

  private modifySeat!: (seat: Seat) => Promise<void>;

  private seats: Array<Seat> = [];

  private newSeat: Seat | null = null;

  private setSeatLocation(e: MouseEvent) {
    const imageElement = e.target as HTMLImageElement;
    if (!imageElement) {
      return;
    }

    this.newSeat = {
      floorId: this.selectedFloor!.id!,
      number: 0,
      ...this.extractPositions(imageElement, e),
    };
  }

  private extractPositions(imageElement: HTMLImageElement, e: MouseEvent) {
    const { offsetX, offsetY } = e;
    const locationX =
      (offsetX * imageElement.naturalWidth) / imageElement.clientWidth;
    const locationY =
      (offsetY * imageElement.naturalHeight) / imageElement.clientHeight;

    return {
      locationX,
      locationY,
    };
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

  private closeModal() {
    this.newSeat = null;
    this.updateSeats();
  }

  @Watch('seatFilter')
  private async updateSeats() {
    this.seats = await this.fetchSeats(this.seatFilter);
  }

  private startDrag(event: DragEvent, seat: Seat): void {
    /* eslint-disable no-param-reassign */
    event.dataTransfer!.dropEffect = 'move';
    event.dataTransfer!.effectAllowed = 'move';
    event.dataTransfer!.setData('seat', seat.id!.toString());
    event.dataTransfer!.setData('offsetX', event.offsetX.toString());
    event.dataTransfer!.setData('offsetY', event.offsetY.toString());
  }

  private onDrop(event: DragEvent) {
    if (!event.dataTransfer || !event.dataTransfer.getData('seat')) {
      return;
    }

    const seatId = Number(event.dataTransfer.getData('seat'));
    const seat = this.seats.find((checkSeat) => checkSeat.id === seatId);

    if (!seat) {
      return;
    }

    const imageElement = event.target as HTMLImageElement;

    if (!imageElement) {
      return;
    }

    const { locationX, locationY } = this.extractPositions(imageElement, event);
    seat.locationX = locationX;
    seat.locationY = locationY;

    this.modifySeat(seat).then(this.updateSeats);
  }
}
</script>

<style lang="scss" scoped>
</style>
