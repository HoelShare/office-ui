<template>
  <div class="authenticated-layout">
    <Navigation />
    <router-view />
    <slot name="footer" />
  </div>
</template>

<script lang="ts">
import Navigation from '@/components/Navigation.vue';
import { Component, Vue } from 'vue-property-decorator';

@Component({
  components: {
    Navigation,
  },
})
export default class LayoutAuthenticated extends Vue {}
</script>

<style scoped lang="scss">
</style>
