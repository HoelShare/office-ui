<template>
  <div
    class="expandable"
    :class="{ 'is--expanded': isExpanded }"
    :style="variables"
  >
    <slot />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class Expandable extends Vue {
  @Prop({ required: false, default: false }) private isExpanded!: boolean;

  @Prop({ required: false, default: 2000 }) private maxHeight!: number;

  private get variables() {
    return {
      '--max-height': `${this.maxHeight ?? 2000}px`,
    };
  }
}
</script>

<style scoped lang="scss">
.expandable {
  transition: max-height 0.4s;
  max-height: 0;
  overflow: hidden;

  &.is--expanded {
    max-height: var(--max-height);
  }
}
</style>
