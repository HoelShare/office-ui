<template>
  <div class="text-field">
    <label :for="id" v-if="label !== null" class="form-label">{{
      label
    }}</label>
    <div class="has-validation">
      <input
        :value="value"
        :type="type"
        class="form-control"
        :class="{ 'is-invalid': errorMessages }"
        @input="$emit('input', $event.target.value)"
        :id="id"
      />
      <template v-if="errorMessages">
        <p v-for="error in errorMessages" :key="error" class="invalid-feedback">
          {{ error }}
        </p>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class TextField extends Vue {
  @Prop({ required: true }) private value!: string;

  @Prop({
    required: false,
    default: () => Math.random().toString(36).substring(7),
  })
  private id!: string;

  @Prop({ required: false, default: 'text' }) private type!: string;

  @Prop({ required: false, default: null }) private label!: string | null;

  @Prop({ required: false, default: undefined }) private error!:
    | string
    | Array<string>
    | undefined;

  get errorMessages(): undefined | Array<string> {
    if (!this.error) {
      return undefined;
    }

    if (this.error instanceof Array) {
      return this.error;
    }

    return [this.error];
  }
}
</script>

<style scoped lang="scss">
</style>
