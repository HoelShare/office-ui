<template>
  <div id="app">
    <component :is="getLayout" />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { mapGetters } from 'vuex';
import Authenticated from '@/layout/Authenticated.vue';
import LayoutLogin from '@/layout/Login.vue';

@Component<App>({
  computed: {
    ...mapGetters(['isAuthenticated']),
  },
  components: {
    [Authenticated.name]: Authenticated,
    [LayoutLogin.name]: LayoutLogin,
  },
})
export default class App extends Vue {
  private isAuthenticated!: boolean;

  private get getLayout(): string {
    if (this.isAuthenticated) {
      return Authenticated.name;
    }

    return LayoutLogin.name;
  }
}
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

:root {
  --color-primary: #2c3e50;
  --color-white: #fff;
  --color-gray: rgb(104, 104, 104);
}
</style>
