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
            @click="setSeatLocation"
            class="img-fluid"
            :src="`${baseUrl}/${selectedFloor.floorPath}`"
            @dragover.prevent
            @dragenter.prevent
            @drop="onDrop"
          />
          <div
            v-for="seat in seats"
            :key="seat.id"
            class="seat"
            :style="seatStyles(seat)"
            :class="seatClass(seat)"
            @click.prevent="newSeat = seat"
            draggable
            @dragstart="startDrag($event, seat)"
          ></div>
          <SeatModal :seat="newSeat" @close="closeModal" />
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
import SeatModal from '@/components/Admin/Seat/Modal.vue';
import TextField from '@/components/TextField.vue';
import Button from '@/components/Button.vue';
import { Building, Floor, NAMES as entity, Seat } from '@/interfaces/Entity';
import { types } from '@/store/entity-api';

@Component({
  components: {
    SelectField,
    Panel,
    SeatModal,
    TextField,
    Button,
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

  private baseUrl!: string | undefined;

  private seats: Array<Seat> = [];

  private newSeat: Seat | null = null;

  private seatClass(seat: Seat) {
    return {
      available: true,
      blocked: seat?.number === 0,
    };
  }

  private seatStyles(seat: Seat) {
    return {
      left: `${seat.locationX}%`,
      top: `${seat.locationY}%`,
    };
  }

  private setSeatLocation(e: MouseEvent) {
    const imageElement = e.target as HTMLImageElement;
    if (!imageElement) {
      return;
    }

    this.newSeat = {
      floorId: this.selectedFloor!.id!,
      number: 0,
      locationX: ((e.offsetX - 10) * 100) / imageElement.width,
      locationY: ((e.offsetY - 10) * 100) / imageElement.height,
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

    const origOffsetX = Number(event.dataTransfer.getData('offsetX') ?? 0);
    const origOffsetY = Number(event.dataTransfer.getData('offsetY') ?? 0);

    seat.locationX = ((event.offsetX - origOffsetX) * 100) / imageElement.width;
    seat.locationY =
      ((event.offsetY - origOffsetY) * 100) / imageElement.height;

    this.modifySeat(seat).then(this.updateSeats);
  }
}
</script>

<style lang="scss" scoped>
.seat-admin {
  .position-relative {
    background: hsla(0, 0%, 100%, 0.1);
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
