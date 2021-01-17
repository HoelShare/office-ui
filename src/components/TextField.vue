<template>
  <div class="text-field">
    <input
      :value="value"
      :type="type"
      @input="$emit('input', $event.target.value)"
      :id="id"
    />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class TextField extends Vue {
  @Prop({ required: true }) private value!: string;

  @Prop({ required: false, default: '' }) private id!: string;

  @Prop({ required: false, default: 'text' }) private type!: string;
}
</script>

<style scoped>
</style>
