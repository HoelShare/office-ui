<template>
  <div class="home">
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
      <div class="row">
        <FloorList :building="selectedBuilding"/>
      </div>
    </Panel>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { mapActions, mapGetters, mapState } from 'vuex';
import SelectField from '@/components/SelectField.vue';
import Panel from '@/components/Panel.vue';
import { Building, NAMES as entity } from '@/interfaces/Entity';
import { types } from '@/store/entity-api';
import FloorList from '@/components/Floor/List.vue';

@Component({
  components: {
    SelectField,
    Panel,
    FloorList,
  },
  computed: {
    ...mapGetters(['isAdmin']),
    ...mapState(entity.building, {
      selectedBuilding: 'current',
    }),
  },
  methods: {
    ...mapActions(entity.building, {
      selectBuilding: types.SET_CURRENT,
    }),
  },
})
export default class HomeView extends Vue {
  private isAdmin!: boolean;

  private selectedBuilding!: Building | null;

  private selectBuilding!: (id: number) => Promise<Building>;
}
</script>
