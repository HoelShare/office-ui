<template>
  <button
    :type="buttonType"
    @click="active ? $emit('click') : null"
    class="btn"
    :class="classes"
    :disabled="!active"
  >
    <slot />
  </button>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class Button extends Vue {
  @Prop({
    required: false,
    default: true,
  })
  private active!: boolean;

  @Prop({
    required: false,
    default: 'default',
    validator: (value) =>
      [
        'primary',
        'secondary',
        'success',
        'danger',
        'warning',
        'info',
        'light',
        'dark',
        'link',
        'default',
      ].indexOf(value) !== -1,
  })
  private type!: string;

  @Prop({
    required: false,
    default: 'normal',
    validator: (value) =>
      ['extra-small', 'small', 'normal', 'big'].indexOf(value) !== -1,
  })
  private size!: string;

  @Prop({ required: false, default: false }) private outline!: boolean;

  get buttonType(): string {
    if (this.type === 'primary') {
      return 'submit';
    }

    return 'button';
  }

  get classes() {
    const outlinePrefix = this.outline ? '-outline' : '';
    return {
      [`btn${outlinePrefix}-${this.type}`]: true,
      'btn-xs': this.size === 'extra-small',
      'btn-sm': this.size === 'small',
      'btn-lg': this.size === 'big',
    };
  }
}
</script>

<style scoped lang="scss">
</style>
