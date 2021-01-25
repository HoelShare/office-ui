<template>
  <div class="building-list-item">
    <div class="expandable row" :class="{ 'is--expanded': !isEditMode }">
      <div class="col-md-8 col-xs-12">{{ building.name }}</div>
      <div class="col-md-4 col-xs-12">
        <div class="d-grid gap-2 d-md-flex justify-content-md-end">
          <Button @click="isEditMode = true" class="me-md-2" type="primary"
            >Edit</Button
          >
          <Button @click="deleteBuilding(building.id)" type="danger"
            >Delete</Button
          >
        </div>
      </div>
    </div>
    <div class="expandable" :class="{ 'is--expanded': isEditMode }">
      <form @submit.prevent="onSave">
        <TextField v-model="building.name" label="Name" :error="error.name" />
        <TextField v-model="building.city" label="City" :error="error.city" />
        <TextField
          v-model="building.postCode"
          label="Post Code"
          :error="error.postCode"
        />
        <TextField
          v-model="building.street"
          label="Street"
          :error="error.street"
        />
        <TextField
          v-model="building.countryCode"
          label="Country Code"
          :error="error.countryCode"
        />
        <div class="d-grid gap-2 d-md-flex justify-content-md-end">
          <Button class="me-md-2" type="primary" :active="!isLoading"
            >Save</Button
          >
          <Button
            type="danger"
            @click="deleteBuilding(building.id)"
            :active="!isLoading"
            >Delete</Button
          >
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import Button from '@/components/Button.vue';
import TextField from '@/components/TextField.vue';
import { Building, NAMES as entity } from '@/interfaces/Entity';
import { types } from '@/store/entity-api';
import { Component, Prop, Vue } from 'vue-property-decorator';
import { mapActions, mapState } from 'vuex';

@Component({
  components: {
    Button,
    TextField,
  },
  computed: mapState(entity.building, ['isLoading']),
  methods: mapActions(entity.building, {
    deleteBuilding: types.DELETE,
    modifyBuilding: types.MODIFY,
  }),
})
export default class BuildingListItem extends Vue {
  @Prop({ required: true }) private building!: Building;

  private isEditMode = false;

  private isLoading!: boolean;

  private deleteBuilding!: (id: number) => Promise<void>;

  private modifyBuilding!: (building: Building) => Promise<Building>;

  private error: object = {};

  private async onSave() {
    try {
      await this.modifyBuilding(this.building);
      this.error = {};
      this.isEditMode = false;
    } catch (axiosError) {
      this.error = axiosError.response.data.errors;
    }
  }
}
</script>

<style scoped lang="scss">
.building-list-item {
  .expandable {
    transition: max-height 0.4s;
    max-height: 0;
    overflow: hidden;

    &.is--expanded {
      max-height: 1000px;
    }
  }
}
</style>
