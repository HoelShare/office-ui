<template>
  <div class="modal fade" :class="{ show: show }">
    <div class="modal-dialog" :class="classes">
      <div class="modal-content">
        <component :is="componentWrapper" @submit.prevent="$emit('save')">
          <div class="modal-header">
            <h5 class="modal-title">
              <slot name="title" />
            </h5>
            <slot name="close-button">
              <Button type="close" @click="$emit('close')"></Button>
            </slot>
          </div>
          <div class="modal-body">
            <slot />
          </div>
          <div class="modal-footer">
            <slot name="footer">
              <Button type="secondary" @click="$emit('close')"> Close </Button>
              <Button type="primary">
                <slot name="save-text"> Save changes </slot>
              </Button>
            </slot>
          </div>
        </component>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import Button from '@/components/Button.vue';

@Component({
  components: {
    Button,
  },
})
export default class Modal extends Vue {
  @Prop({ required: false, default: false }) private show!: boolean;

  @Prop({ required: false, default: true }) private isForm!: boolean;

  @Prop({
    required: false,
    default: null,
    validator: (value) =>
      ['sm', 'md', 'lg', 'xl', 'xxl', null].indexOf(value) !== -1,
  })
  private minSize!: null | string;

  private get componentWrapper(): string {
    if (this.isForm) {
      return 'form';
    }

    return 'div';
  }

  private get classes(): object {
    return {
      [`modal-fullscreen-${this.minSize}-down`]: this.minSize !== null,
    };
  }
}
</script>

<style scoped lang="scss">
.modal.show {
  display: block;
  background-color: rgba($color: #000000, $alpha: 0.5);
}
</style>
