<template>
  <div class="create-new-building">
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
      <template #title> Add New Building </template>
      <TextField v-model="newBuilding.name" label="Name" :error="error.name" />
      <TextField v-model="newBuilding.city" label="City" :error="error.city" />
      <TextField
        v-model="newBuilding.postCode"
        label="Post Code"
        :error="error.postCode"
      />
      <TextField
        v-model="newBuilding.street"
        label="Street"
        :error="error.street"
      />
      <TextField
        v-model="newBuilding.countryCode"
        label="Country Code"
        :error="error.countryCode"
      />
    </Modal>
  </div>
</template>

<script lang="ts">
import { Building, NAMES as entity } from '@/interfaces/Entity';
import { types } from '@/store/entity-api';
import { Component, Vue } from 'vue-property-decorator';
import TextField from '@/components/TextField.vue';
import Button from '@/components/Button.vue';
import Modal from '@/components/Modal.vue';
import { mapActions, mapState } from 'vuex';

@Component({
  components: {
    TextField,
    Button,
    Modal,
  },
  methods: mapActions(entity.building, {
    createBuilding: types.CREATE,
  }),
  computed: mapState(entity.building, ['isLoading']),
})
export default class BuildingCreate extends Vue {
  private newBuilding: Building = { name: '' };

  private showModal = false;

  private isLoading!: boolean;

  private error: object = {};

  private createBuilding!: (
    building: Building
  ) => Promise<Building | { error: object }>;

  private async doAddNew(): Promise<void> {
    try {
      console.log('Submitted');

      await this.createBuilding(this.newBuilding);

      this.newBuilding = { name: '' };
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
