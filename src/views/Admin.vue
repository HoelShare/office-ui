<template>
  <div class="admin" v-if="isAdmin">
    <BuildingList />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import BuildingList from '@/components/Admin/Building/List.vue';
import { mapGetters } from 'vuex';

@Component({
  components: {
    BuildingList,
  },
  computed: mapGetters(['isAdmin']),
})
export default class AdminView extends Vue {
  private isAdmin!: boolean;
}
</script>
