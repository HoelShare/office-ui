<template>
  <nav class="navbar navbar-expand">
    <div class="container-fluid">
      <a class="navbar-brand" href="https://github.com/hoelshare/office-ui"
        >GitHub</a
      >
      <ul class="navbar-nav">
        <router-link
          exact-active-class="active"
          class="nav-link"
          :to="{ name: 'Home' }"
          >Home</router-link
        >
        <router-link
          active-class="active"
          class="nav-link"
          :to="{ name: 'Bookings' }"
          >Bookings</router-link
        >
        <template v-if="isAdmin">
          <router-link
            active-class="active"
            class="nav-link"
            :to="{ name: 'Admin' }"
            >Admin</router-link
          >
        </template>
        <router-link
          active-class="active"
          class="nav-link"
          :to="{ name: 'About' }"
          >About</router-link
        >
        <router-link
          active-class="active"
          class="nav-link"
          :to="{ name: 'Logout' }"
          >Logout</router-link
        >
      </ul>
    </div>
  </nav>
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
</style>
