<template>
  <div class="floor-list-item">
    <Expandable class="row" :isExpanded="!isEditMode">
      <div class="col-md-8 col-xs-12">{{ floor.name }}</div>
      <div class="col-md-4 col-xs-12" v-if="isAdmin">
        <div class="d-grid gap-2 d-md-flex justify-content-md-end">
          <Button @click="setEditMode" class="me-md-2" type="primary"
            >Edit</Button
          >
          <Button
            @click="onDelete"
            :active="!isLoading && floor.id"
            type="danger"
            >Delete</Button
          >
        </div>
      </div>
    </Expandable>
    <Expandable
      :isExpanded="isEditMode"
      v-if="isAdmin"
      :maxHeight="expandedHeight"
    >
      <form @submit.prevent="onSave">
        <TextField v-model="floor.name" label="Name" :error="error.name" />
        <TextField
          v-model="floor.number"
          label="Number"
          :error="error.number"
        />
        <input type="file" ref="file" />
        <img
          v-if="floor.floorPath"
          ref="image"
          class="img-fluid"
          :src="`${baseUrl}/${floor.floorPath}`"
        />
        <div class="d-grid gap-2 d-md-flex justify-content-md-end mt-2">
          <Button class="me-md-2" type="primary" :active="!isLoading"
            >Save</Button
          >
          <Button
            type="danger"
            @click="onDelete"
            :active="!isLoading && floor.id"
            >Delete</Button
          >
        </div>
      </form>
    </Expandable>
  </div>
</template>

<script lang="ts">
import Button from '@/components/Button.vue';
import TextField from '@/components/TextField.vue';
import Expandable from '@/components/Expandable.vue';
import { Floor, NAMES as entity } from '@/interfaces/Entity';
import { types } from '@/store/entity-api';
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { mapActions, mapGetters, mapState } from 'vuex';
import { NAME as floorMapName } from '@/store/floor-api';

@Component({
  components: {
    Button,
    TextField,
    Expandable,
  },
  computed: {
    ...mapGetters(['isAdmin', 'baseUrl']),
    ...mapState(entity.floor, ['isLoading']),
  },
  methods: {
    ...mapActions(entity.floor, {
      deleteFloor: types.DELETE,
      modifyFloor: types.MODIFY,
    }),
    ...mapActions(floorMapName, {
      createMap: types.CREATE,
    }),
  },
})
export default class FloorListItem extends Vue {
  @Prop({ required: true }) private floor!: Floor;

  private isAdmin!: boolean;

  private isEditMode = false;

  private isLoading!: boolean;

  private deleteFloor!: (id: number) => Promise<void>;

  private modifyFloor!: (floor: Floor) => Promise<Floor>;

  private error: object = {};

  private baseUrl!: string | undefined;

  private expandedHeight: number | null = null;

  private createMap!: ({
    id,
    file,
  }: {
    id: number;
    file: File;
  }) => Promise<void>;

  private setEditMode(): void {
    this.isEditMode = true;
    this.$nextTick().then(() => this.imageHeight());
  }

  private async imageHeight() {
    const imageRef = await this.$refs.image as HTMLImageElement | undefined;

    if (!imageRef || !this.isEditMode) {
      this.expandedHeight = null;
      return;
    }

    this.expandedHeight = 2000 + imageRef.height;
  }

  private async onDelete() {
    if (!this.floor.id) {
      return;
    }

    await this.deleteFloor(this.floor.id);
    this.$emit('deleted', this.floor);
  }

  private async onSave() {
    try {
      const floor = await this.modifyFloor(this.floor);

      const fileInput = this.$refs.file as HTMLInputElement;
      if ((fileInput.files?.length || 0) > 0 && 'id' in floor) {
        const file = fileInput.files![0];
        await this.createMap({ id: floor.id!, file });
      }

      this.error = {};
      this.isEditMode = false;
    } catch (axiosError) {
      this.error = axiosError.response.data.errors;
    }
  }
}
</script>

<style scoped>
</style>
