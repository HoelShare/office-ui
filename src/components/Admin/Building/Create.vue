<template>
  <div class="create-new-building">
    <Panel>
      <form @submit.prevent="doAddNew">
        <TextField
          v-model="newBuilding.name"
          label="Name"
          :error="error.name"
        />
        <TextField
          v-model="newBuilding.city"
          label="City"
          :error="error.city"
        />
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
        <Button type="primary" :active="!isLoading">Add New</Button>
      </form>
    </Panel>
  </div>
</template>

<script lang="ts">
import { Building, NAMES as entity } from '@/interfaces/Entity';
import { types } from '@/store/entity-api';
import { Component, Vue } from 'vue-property-decorator';
import TextField from '@/components/TextField.vue';
import Button from '@/components/Button.vue';
import Panel from '@/components/Panel.vue';
import { mapActions, mapState } from 'vuex';

@Component({
  components: {
    TextField,
    Button,
    Panel,
  },
  methods: mapActions(entity.building, {
    createBuilding: types.CREATE,
  }),
  computed: mapState(entity.building, ['isLoading']),
})
export default class BuildingCreate extends Vue {
  private newBuilding: Building = { name: '' };

  private isLoading!: boolean;

  private error: object = {};

  private createBuilding!: (
    building: Building
  ) => Promise<Building | { error: object }>;

  private async doAddNew(): Promise<void> {
    try {
      await this.createBuilding(this.newBuilding);

      this.newBuilding = { name: '' };
      this.error = {};
    } catch (axiosError) {
      this.error = axiosError.response.data.errors;
    }
  }
}
</script>

<style scoped>
</style>
