<template>
  <Modal :show="seat !== null" @save="addSeat" @close="$emit('close')">
    <template #title>
      <template v-if="seat && !seat.id">Add New Seat</template>
      <template v-else>Modify Seat</template>
    </template>
    <template v-if="seat">
      <TextField v-model="seat.number" />
      <template v-if="seat.id">
        <div v-for="assetGroup in assetGroups" :key="assetGroup">
          <h3 class="list-title pt-3">{{ assetGroup }}</h3>
          <ul class="list-group">
            <li
              v-for="asset in getGroupElements(assetGroup)"
              :key="asset.id"
              class="list-group-item"
            >
              <input
                class="form-check-input me-1"
                type="checkbox"
                :checked="checkSelected(asset)"
                @input="toggleAsset(asset)"
              />
              {{ asset.name }}
            </li>
          </ul>
        </div>
      </template>
    </template>
    <template #additional-footer v-if="seat && seat.id">
      <Button @click="doDeleteSeat(seat)" type="danger">Delete</Button>
    </template>
  </Modal>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import Modal from '@/components/Modal.vue';
import TextField from '@/components/TextField.vue';
import Button from '@/components/Button.vue';
import { Seat, NAMES as entity, SeatAsset, Asset } from '@/interfaces/Entity';
import { mapActions, mapState } from 'vuex';
import { types } from '@/store/entity-api';

@Component({
  components: {
    Modal,
    TextField,
    Button,
  },
  computed: {
    ...mapState(entity.seat, {
      seatsLoading: 'isLoading',
    }),
    ...mapState(entity.asset, {
      assets: 'list',
    }),
  },
  methods: {
    ...mapActions(entity.seat, {
      createSeat: types.CREATE,
      updateSeat: types.MODIFY,
      deleteSeat: types.DELETE,
    }),
    ...mapActions(entity.seatAsset, {
      fetchSeatAssets: types.FETCH_LIST,
      createSeatAsset: types.CREATE,
      deleteSeatAsset: types.DELETE,
    }),
    ...mapActions(entity.asset, {
      fetchAssets: types.FETCH_LIST,
    }),
  },
})
export default class SeatModal extends Vue {
  @Prop({ required: false, default: null }) seat!: Seat | null;

  private seatAssets: Array<SeatAsset> = [];

  private assets!: Array<Asset>;

  private fetchSeatAssets!: (filter?: object) => Promise<Array<SeatAsset>>;

  private fetchAssets!: () => Promise<Array<Asset>>;

  private deleteSeat!: (id: number) => Promise<void>;

  private createSeat!: (seat: Seat) => Promise<void>;

  private updateSeat!: (seat: Seat) => Promise<void>;

  private createSeatAsset!: (seatAsset: SeatAsset) => Promise<void>;

  private deleteSeatAsset!: (id: number) => Promise<void>;

  private checkSelected(asset: Asset): boolean {
    return this.seatAssets.some(
      (seatAsset: SeatAsset) => seatAsset.assetId === asset.id || seatAsset.asset?.id === asset.id,
    );
  }

  private toggleAsset(asset: Asset) {
    let seatAsset = this.seatAssets.find(
      (toCheck: SeatAsset) => toCheck.assetId === asset.id || toCheck.asset?.id === asset.id,
    );

    if (seatAsset) {
      this.deleteSeatAsset(seatAsset.id!).then(this.doFetchSeatAssets);
      return;
    }
    seatAsset = { seatId: this.seat!.id!, assetId: asset.id!, priority: 1 };
    this.createSeatAsset(seatAsset).then(this.doFetchSeatAssets);
  }

  @Watch('seat', { immediate: true })
  private async doFetchSeatAssets(): Promise<void> {
    if (!this.seat || !this.seat.id) {
      return;
    }

    this.seatAssets = await this.fetchSeatAssets({
      where: { seat: this.seat.id! },
      orderBy: 'priority',
    });
    this.fetchAssets();
  }

  private get assetGroups(): Array<string> {
    return [...new Set(this.assets.map((asset) => asset.type))];
  }

  private getGroupElements(group: string): Array<Asset> {
    return this.assets.filter((asset) => asset.type === group);
  }

  private doDeleteSeat(seat: Seat): void {
    if (!seat.id) {
      this.$emit('close');
      return;
    }

    this.deleteSeat(seat.id).then(() => {
      this.$emit('close');
    });
  }

  private addSeat(): void {
    if (!this.seat) {
      return;
    }

    if (this.seat.id) {
      this.updateSeat(this.seat).then(() => {
        this.$emit('close');
      });
      return;
    }

    this.createSeat(this.seat).then(() => {
      this.$emit('close');
    });
  }
}
</script>

<style scoped>
</style>
