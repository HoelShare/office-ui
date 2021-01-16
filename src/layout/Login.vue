<template>
  <div class="login-layout">
    <router-view />
    <slot name="footer" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class LayoutLogin extends Vue {}
</script>

<style scoped lang="scss">
</style>
