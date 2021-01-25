<template>
  <div class="login">
    <LdapLoginComponent v-if="method == 'ldap'" />
    <SamlLoginComponent v-else-if="method == 'saml'" />
    <p v-else>Unknown Authentication Method</p>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import LdapLoginComponent from '@/components/Login/LdapLogin.vue';
import SamlLoginComponent from '@/components/Login/SamlLogin.vue';

@Component({
  components: {
    LdapLoginComponent,
    SamlLoginComponent,
  },
})
export default class LoginView extends Vue {
  private method: string;

  constructor() {
    super();
    this.method = process.env.VUE_APP_AUTH_METHOD ?? process.env.AUTH_METHOD ?? 'unknown';
  }
}
</script>

<style scoped lang="scss">

</style>
