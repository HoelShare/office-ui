<template>
  <div class="container">
    <div class="card">
      <div class="card-header" v-if="$slots.header">
        <slot name="header" />
      </div>
      <div class="card-body">
        <slot />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class Panel extends Vue {}
</script>

<style scoped lang="scss">
.panel {
  border-radius: 5px;
  background-color: #f2f2f2;
  padding: 20px;
}
</style>
