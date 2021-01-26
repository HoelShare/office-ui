<template>
  <div class="floor-list-item">
    <Expandable class="row" :isExpanded="!isEditMode">
      <div class="col-md-8 col-xs-12">{{ floor.name }}</div>
      <div class="col-md-4 col-xs-12" v-if="isAdmin">
        <div class="d-grid gap-2 d-md-flex justify-content-md-end">
          <Button @click="isEditMode = true" class="me-md-2" type="primary"
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
    <Expandable :isExpanded="isEditMode" v-if="isAdmin">
      <form @submit.prevent="onSave">
        <TextField v-model="floor.name" label="Name" :error="error.name" />
        <TextField
          v-model="floor.number"
          label="Number"
          :error="error.number"
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
import { Component, Prop, Vue } from 'vue-property-decorator';
import { mapActions, mapGetters, mapState } from 'vuex';

@Component({
  components: {
    Button,
    TextField,
    Expandable,
  },
  computed: {
    ...mapGetters(['isAdmin']),
    ...mapState(entity.floor, ['isLoading']),
  },
  methods: mapActions(entity.floor, {
    deleteFloor: types.DELETE,
    modifyFloor: types.MODIFY,
  }),
})
export default class FloorListItem extends Vue {
  @Prop({ required: true }) private floor!: Floor;

  private isAdmin!: boolean;

  private isEditMode = false;

  private isLoading!: boolean;

  private deleteFloor!: (id: number) => Promise<void>;

  private modifyFloor!: (floor: Floor) => Promise<Floor>;

  private error: object = {};

  private async onDelete() {
    if (!this.floor.id) {
      return;
    }

    await this.deleteFloor(this.floor.id);
    this.$emit('deleted', this.floor);
  }

  private async onSave() {
    try {
      await this.modifyFloor(this.floor);
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
