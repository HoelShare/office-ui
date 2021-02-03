<template>
  <div class="asset-list-item">
    <Expandable class="row" :isExpanded="!isEditMode">
      <div class="col-md-8 col-xs-12">{{ asset.name }}</div>
      <div class="col-md-4 col-xs-12" v-if="isAdmin">
        <div class="d-grid gap-2 d-md-flex justify-content-md-end">
          <Button @click="isEditMode = true" class="me-md-2" type="primary"
            >Edit</Button
          >
          <Button
            @click="onDelete"
            :active="!isLoading && asset.id"
            type="danger"
            >Delete</Button
          >
        </div>
      </div>
    </Expandable>
    <Expandable :isExpanded="isEditMode" v-if="isAdmin">
      <form @submit.prevent="onSave">
        <TextField v-model="asset.name" label="Name" :error="error.name" />
        <div class="d-grid gap-2 d-md-flex justify-content-md-end mt-2">
          <Button class="me-md-2" type="primary" :active="!isLoading"
            >Save</Button
          >
          <Button
            type="danger"
            @click="onDelete"
            :active="!isLoading && asset.id"
            >Delete</Button
          >
        </div>
      </form>
    </Expandable>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import Button from '@/components/Button.vue';
import Expandable from '@/components/Expandable.vue';
import TextField from '@/components/TextField.vue';
import { mapActions, mapGetters, mapState } from 'vuex';
import { types } from '@/store/entity-api';
import { Asset, NAMES as entity } from '@/interfaces/Entity';

@Component({
  components: {
    Button,
    Expandable,
    TextField,
  },
  computed: {
    ...mapGetters(['isAdmin']),
    ...mapState(entity.asset, ['isLoading']),
  },
  methods: mapActions(entity.asset, {
    deleteAsset: types.DELETE,
    modifyAsset: types.MODIFY,
  }),
})
export default class AssetListItem extends Vue {
  @Prop({ required: true }) private asset!: Asset;

  private isEditMode = false;

  private isAdmin!: boolean;

  private isLoading!: boolean;

  private deleteAsset!: (id: number) => Promise<void>;

  private modifyAsset!: (asset: Asset) => Promise<Asset>;

  private error: object = {};

  private async onDelete() {
    if (!this.asset.id) {
      return;
    }

    await this.deleteAsset(this.asset.id);
    this.$emit('deleted', this.asset);
  }

  private async onSave() {
    try {
      await this.modifyAsset(this.asset);
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
