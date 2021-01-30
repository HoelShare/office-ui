<template>
  <div id="app">
    <component :is="getLayout" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { mapGetters } from 'vuex';
import Authenticated from '@/layout/Authenticated.vue';
import Login from '@/layout/Login.vue';

@Component<App>({
  computed: {
    ...mapGetters(['isAuthenticated']),
  },
  components: {
    LayoutAuthenticated: Authenticated,
    LayoutLogin: Login,
  },
})
export default class App extends Vue {
  private isAuthenticated!: boolean;

  private get getLayout(): string {
    if (this.isAuthenticated) {
      return 'LayoutAuthenticated';
    }

    return 'LayoutLogin';
  }
}
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
