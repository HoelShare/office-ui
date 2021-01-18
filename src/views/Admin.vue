<template>
  <div class="admin" v-if="isAdmin">
    <p>Is Loading Entity: {{ isLoadingEntity }}</p>
    <p>Is Loading Map: {{ isLoadingMap }}</p>
    <SelectField entity="floor" v-model="floor.buildingId" />
    <TextField v-model="floor.name" />
    <TextField v-model="floor.number" />
    <input type="file" ref="file" />
    <Button type="primary" @click="save">Abschicken</Button>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import ModifyBuilding from '@/components/Admin/Building.vue';
import TextField from '@/components/TextField.vue';
import Button from '@/components/Button.vue';
import SelectField from '@/components/SelectField.vue';
import { mapActions, mapGetters, mapState } from 'vuex';
import { types } from '@/store/entity-api';
import { Floor, NAMES as entity } from '@/interfaces/Entity';
import { NAME as floorMapName } from '@/store/floor-api';

@Component({
  components: {
    ModifyBuilding,
    TextField,
    Button,
    SelectField,
  },
  methods: {
    ...mapActions(floorMapName, {
      createMap: types.CREATE,
    }),
    ...mapActions(entity.floor, {
      createFloor: types.CREATE,
    }),
  },
  computed: {
    ...mapGetters(['isAdmin']),
    ...mapState(floorMapName, {
      isLoadingMap: 'isLoading',
    }),
    ...mapState(entity.floor, {
      isLoadingEntity: 'isLoading',
    }),
  },
})
export default class AdminView extends Vue {
  private isAdmin!: boolean;

  private isLoadingMap!: boolean;

  private isLoadingEntity!: boolean;

  private floor: Floor = { buildingId: 4 };

  private createFloor!: (floor: Floor) => Promise<Floor>;

  private createMap!: ({
    id,
    file,
  }: {
    id: number;
    file: File;
  }) => Promise<void>;

  private async save(): Promise<void> {
    this.floor = await this.createFloor(this.floor);

    const file = this.$refs.file.files[0];
    await this.createMap({ id: this.floor.id!, file });
  }
}
</script>
