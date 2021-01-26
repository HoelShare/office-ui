<template>
  <div class="expandable" :class="{ 'is--expanded': isExpanded }">
    <slot />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class Expandable extends Vue {
  @Prop({ required: false, default: false }) private isExpanded!: boolean;
}
</script>

<style scoped lang="scss">
.expandable {
    transition: max-height 0.4s;
    max-height: 0;
    overflow: hidden;

    &.is--expanded {
      max-height: 1000px;
    }
  }
</style>
