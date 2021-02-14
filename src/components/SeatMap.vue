<template>
  <div class="position-relative">
    <div class="w-100">
      <img
        v-if="floor && floor.floorPath"
        @click="$emit('click', $event)"
        class="img-fluid"
        :src="`${baseUrl}/${floor.floorPath}`"
        @dragover.prevent
        @dragenter.prevent
        @drop="$emit('dropSeat', $event)"
      />
      <div
        v-for="seat in seats"
        :key="seat.id"
        class="seat"
        :style="seatStyles(seat)"
        :class="seatClass(seat)"
        @click.prevent="$emit('selectSeat', seat)"
        draggable
        @dragstart="$emit('startDrag', $event, seat)"
      ></div>
    </div>
  </div>
</template>

<script lang="ts">
import { Floor, Seat } from '@/interfaces/Entity';
import { Component, Prop, Vue } from 'vue-property-decorator';
import { mapGetters } from 'vuex';

@Component({
  computed: mapGetters(['baseUrl']),
})
export default class SeatMap extends Vue {
  @Prop({ required: true }) floor!: Floor | null;

  @Prop({ required: true }) seats!: Array<Seat>;

  private baseUrl!: string | undefined;

  private seatStyles(seat: Seat) {
    return {
      left: `${seat.locationX}%`,
      top: `${seat.locationY}%`,
    };
  }

  private seatClass(seat: Seat) {
    return {
      available: true,
      blocked: seat?.number === 0,
    };
  }
}
</script>

<style scoped lang="scss">
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
</style>
