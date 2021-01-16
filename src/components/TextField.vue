<template>
  <div class="text-field">
    <input :value="value" @input="$emit('input', $event.target.value)" />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class TextField extends Vue {
  @Prop({ required: true }) private value!: string;
}
</script>

<style scoped>
</style>
