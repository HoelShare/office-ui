<template>
  <div class="asset-admin">
    <Panel>
      <Button type="primary" @click="asset = {}">Add</Button>
      <Modal :show="asset !== null" @save="addAsset" @close="asset = null">
        <template #title>Add Asset</template>
        <template v-if="asset">
          <TextField v-model="asset.type" label="Type" />
          <TextField v-model="asset.name" label="Name" />
        </template>
      </Modal>
    </Panel>
      <Panel class="mt-2" v-for="group in getGroups()" :key="group">
        <template #header>{{ group }}</template>
        <div v-for="asset in getElements(group)" :key="asset.id">
            <AssetListItem class="mb-2" :asset="asset"/>
        </div>
        <Button type="primary" @click="asset = { type: group }">Add</Button>
      </Panel>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Panel from '@/components/Panel.vue';
import Modal from '@/components/Modal.vue';
import TextField from '@/components/TextField.vue';
import Button from '@/components/Button.vue';
import { mapActions, mapState } from 'vuex';
import { Asset, NAMES as entity } from '@/interfaces/Entity';
import { types } from '@/store/entity-api';
import AssetListItem from '@/components/Admin/Asset/ListItem.vue';

@Component({
  components: {
    Panel,
    TextField,
    Modal,
    Button,
    AssetListItem,
  },
  computed: {
    ...mapState(entity.asset, ['isLoading', 'list']),
  },
  methods: mapActions(entity.asset, {
    fetchAssets: types.FETCH_LIST,
    createAsset: types.CREATE,
  }),
})
export default class AdminAssetView extends Vue {
  private asset: Asset | null = null;

  private fetchAssets!: () => Promise<void>;

  private createAsset!: (asset: Asset) => Promise<void>;

  private isLoading!: boolean;

  private list!: Array<Asset>;

  private getGroups(): Array<string> {
    return [...new Set(this.list.map((asset) => asset.type))];
  }

  private getElements(group: string): Array<Asset> {
    return this.list.filter((asset) => asset.type === group);
  }

  private mounted() {
    this.fetchAssets();
  }

  private addAsset() {
    if (!this.asset) {
      return;
    }

    this.createAsset(this.asset)
      .then(() => {
        this.asset = null;
      })
      .then(this.fetchAssets);
  }
}
</script>

<style scoped>
</style>
