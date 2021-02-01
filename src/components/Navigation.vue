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
          <li class="nav-item dropdown" :class="{ show: expandedAdmin }">
            <a
              class="nav-link dropdown-toggle"
              href="#"
              id="navbarDropdown"
              role="button"
              @click.prevent="open"
              :aria-expanded="expandedAdmin"
            >
              Admin
            </a>
            <ul
              class="dropdown-menu"
              aria-labelledby="navbarDropdown"
              :class="{ show: expandedAdmin }"
            >
              <li>
                <router-link
                  class="dropdown-item"
                  :to="{ name: 'AdminBuilding' }"
                  >Building</router-link
                >
              </li>
              <li>
                <router-link class="dropdown-item" :to="{ name: 'AdminFloor' }"
                  >Floor</router-link
                >
              </li>
              <li>
                <router-link class="dropdown-item" :to="{ name: 'AdminSeat' }"
                  >Seats</router-link
                >
              </li>
            </ul>
          </li>
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

  private expandedAdmin = false;

  mounted() {
    document.addEventListener('click', this.close);
  }

  beforeDestroy() {
    document.removeEventListener('click', this.close);
  }

  open() {
    this.expandedAdmin = !this.expandedAdmin;
  }

  close(e: MouseEvent) {
    if (!(e.target instanceof Element)) {
      return;
    }

    if (
      !this.$el.contains(e.target) ||
      !e.target.classList.contains('dropdown-toggle')
    ) {
      this.expandedAdmin = false;
    }
  }
}
</script>

<style scoped lang="scss">
</style>
