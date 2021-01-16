<template>
  <div class="navigation">
    <router-link :to="{ name: 'Home' }">Home</router-link> |
    <router-link :to="{ name: 'Bookings' }">Bookings</router-link> |
    <template v-if="isAdmin">
      <router-link :to="{ name: 'Admin' }">Admin</router-link>
      |
    </template>
    <router-link :to="{ name: 'About' }">About</router-link>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { mapGetters } from 'vuex';

@Component({
  computed: {
    ...mapGetters(['isAdmin']),
  },
})
export default class Navigation extends Vue {
  private isAdmin!: boolean;
}
</script>

<style scoped lang="scss">
.navigation {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
