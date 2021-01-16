<template>
  <div>You are now logged out</div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { mapActions } from 'vuex';

@Component({
  methods: mapActions(['logout']),
})
export default class LogoutView extends Vue {
  logout!: () => Promise<void>;

  mounted() {
    this.logout().then(() => {
      this.$router.replace({ name: 'Login' });
    });
  }
}
</script>

<style scoped>
</style>
