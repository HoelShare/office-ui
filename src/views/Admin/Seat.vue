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
      <div class="w-100">
        <img
          v-if="selectedFloor && selectedFloor.floorPath"
          @click="addSeat"
          class="img-fluid"
          :src="`${baseUrl}/${selectedFloor.floorPath}`"
        />
      </div>
    </Panel>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { mapActions, mapGetters, mapState } from 'vuex';
import SelectField from '@/components/SelectField.vue';
import Panel from '@/components/Panel.vue';
import { Building, Floor, NAMES as entity } from '@/interfaces/Entity';
import { types } from '@/store/entity-api';

@Component({
  components: {
    SelectField,
    Panel,
  },
  computed: {
    ...mapGetters(['isAdmin', 'baseUrl']),
    ...mapState(entity.building, {
      selectedBuilding: 'current',
    }),
    ...mapState(entity.floor, {
      selectedFloor: 'current',
    }),
  },
  methods: {
    ...mapActions(entity.building, {
      selectBuilding: types.SET_CURRENT,
    }),
    ...mapActions(entity.floor, {
      selectFloor: types.SET_CURRENT,
    }),
  },
})
export default class AdminSeatView extends Vue {
  private isAdmin!: boolean;

  private selectedBuilding!: Building | null;

  private selectBuilding!: (id: number) => Promise<Building>;

  private selectedFloor!: Floor | null;

  private selectFloor!: (id: number) => Promise<Floor>;

  private baseUrl!: string | undefined;

  private addSeat(e: MouseEvent) {
    const imageElement = e.target as HTMLImageElement;
    if (!imageElement) {
      return;
    }
    // TODO: Find correct click position
  }

  private get floorFilter() {
    if (!this.selectedBuilding) {
      return undefined;
    }

    return { where: { building: this.selectedBuilding?.id } };
  }
}
</script>
