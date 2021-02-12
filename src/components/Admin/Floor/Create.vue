<template>
  <div class="create-new-Floor">
    <Button type="primary" :active="!showModal" @click="showModal = true"
      >Add New</Button
    >

    <Modal
      v-show="showModal"
      @close="showModal = false"
      @save="doAddNew"
      :show="showModal"
      minSize="sm"
    >
      <template #title> Add New Floor </template>
      <TextField v-model="newFloor.name" label="Name" :error="error.name" />
      <TextField
        v-model="newFloor.number"
        label="Number"
        :error="error.number"
      />
      <input type="file" ref="file" />
    </Modal>
  </div>
</template>

<script lang="ts">
import { Building, Floor, NAMES as entity } from '@/interfaces/Entity';
import { types } from '@/store/entity-api';
import { Component, Prop, Vue } from 'vue-property-decorator';
import TextField from '@/components/TextField.vue';
import Button from '@/components/Button.vue';
import Modal from '@/components/Modal.vue';
import { mapActions, mapState } from 'vuex';
import { NAME as floorMapName } from '@/store/floor-api';

@Component({
  components: {
    TextField,
    Button,
    Modal,
  },
  methods: {
    ...mapActions(entity.floor, {
      createFloor: types.CREATE,
    }),
    ...mapActions(floorMapName, {
      createMap: types.CREATE,
    }),
  },
  computed: {
    ...mapState(entity.floor, ['isLoading']),
    ...mapState(entity.building, {
      currentBuilding: 'current',
    }),
  },
})
export default class FloorCreate extends Vue {
  private newFloor = {};

  private showModal = false;

  private currentBuilding!: Building;

  @Prop({ required: false, default: null }) private buildingId!: number | null;

  private isLoading!: boolean;

  private error: object = {};

  private createFloor!: (floor: Floor) => Promise<Floor | { error: object }>;

  private createMap!: ({
    id,
    file,
  }: {
    id: number;
    file: File;
  }) => Promise<void>;

  private async doAddNew(): Promise<void> {
    try {
      const id = this.buildingId || (this.currentBuilding || {}).id;

      if (!id) {
        this.error = { name: 'No building selected' };
        return;
      }

      const floor = await this.createFloor({
        buildingId: id,
        ...this.newFloor,
      });

      const fileInput = this.$refs.file as HTMLInputElement;
      if ((fileInput.files?.length || 0) > 0 && 'id' in floor) {
        const file = fileInput.files![0];
        await this.createMap({ id: floor.id!, file });
      }

      this.$emit('created', this.newFloor);
      this.newFloor = {};
      this.error = {};
      this.showModal = false;
    } catch (axiosError) {
      this.error = axiosError.response.data.errors;
    }
  }
}
</script>

<style scoped lang="scss">
</style>
