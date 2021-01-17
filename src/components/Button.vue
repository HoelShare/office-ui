<template>
  <button
    :type="buttonType"
    @click="active ? $emit('click') : null"
    class="button"
    :class="classes"
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
    default: 'secondary',
    validator: (value) => ['primary', 'secondary'].indexOf(value) !== -1,
  })
  private type!: string;

  @Prop({
    required: false,
    default: 'normal',
    validator: (value) => ['small', 'normal', 'big'].indexOf(value) !== -1,
  })
  private size!: string;

  get buttonType(): string {
    if (this.type === 'primary') {
      return 'submit';
    }

    return 'button';
  }

  get classes() {
    return {
      primary: this.type === 'primary',
      secondary: this.type === 'secondary',
      'size--normal': this.size === 'normal',
      'size--small': this.size === 'small',
      'size--big': this.size === 'big',
      'in-active': !this.active,
    };
  }
}
</script>

<style scoped lang="scss">
.button {
  box-sizing: border-box;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  cursor: pointer;
  user-select: none;
  font-weight: bold;
  text-align: center;
  color: var(--color-white);

  border: solid 2px var(--color-primary);

  &.size--big {
    padding: 23px;
    border-radius: 10px;
    font-size: 23px;
  }

  &.size--normal {
    padding: 10px 15px;
    border-radius: 10px;
    font-size: 19px;
  }

  &.size--small {
    padding: 3px 5px;
    border-radius: 10px;
    font-size: 14px;
  }

  &:not(.primary) {
    background-color: var(--color-gray);
  }

  &.primary {
    background-color: var(--color-primary);
  }

  &.in-active {
    cursor: not-allowed;
    opacity: 0.5;
  }
}
</style>
