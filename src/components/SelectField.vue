<template>
  <div class="select-field">
    <label :for="id" v-if="label !== null" class="form-label">{{
      label
    }}</label>
    <div class="has-validation">
      <select
        :value="value"
        class="form-control"
        :class="{ 'is-invalid': errorMessages }"
        @input="$emit('input', $event.target.value)"
        :id="id"
      >
        <option
          v-for="item in list"
          :key="item[valueField]"
          :value="item[valueField]"
        >
          {{ item[labelField] }}
        </option>
      </select>
      <template v-if="errorMessages">
        <p v-for="error in errorMessages" :key="error" class="invalid-feedback">
          {{ error }}
        </p>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import { types } from '@/store/entity-api';
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { mapActions } from 'vuex';

@Component({
  methods: mapActions({
    fetchList(dispatch, params) {
      return dispatch(`${this.entity}/${types.FETCH_LIST}`, params);
    },
  }),
})
export default class SelectField extends Vue {
  @Prop({
    required: false,
    default: () => Math.random().toString(36).substring(7),
  })
  private id!: string;

  @Prop({ required: true }) private entity!: string;

  @Prop({ required: false, default: 'name' }) private labelField!: string;

  @Prop({ required: false, default: 'id' }) private valueField!: string;

  @Prop({ required: true }) private value!: any;

  @Prop({ required: false, default: null }) private label!: string | null;

  @Prop({ required: false, default: undefined }) private error!:
    | string
    | Array<string>
    | undefined;

  @Prop({
    required: false,
    default: undefined,
  })
  private filter!: object | undefined;

  private list: Array<object> = [];

  private fetchList!: (filter?: object | undefined) => Promise<Array<object>>;

  get errorMessages(): undefined | Array<string> {
    if (!this.error) {
      return undefined;
    }

    if (this.error instanceof Array) {
      return this.error;
    }

    return [this.error];
  }

  @Watch('filter', { deep: true, immediate: true })
  private async fetch() {
    this.list = await this.fetchList(this.filter);
  }
}
</script>

<style scoped lang="scss">
</style>
