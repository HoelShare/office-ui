<template>
  <div class="login-wrapper">
    <h1 class="title">SSO Login</h1>
    <div v-if="error">{{ error }}</div>
    <Button @click="doSamlLogin" type="primary">Login with SSO</Button>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { mapActions } from 'vuex';
import Button from '@/components/Button.vue';
import TextField from '@/components/TextField.vue';
import { LoginResponse } from '@/interfaces/Login';

@Component({
  methods: mapActions(['doSamlLogin']),
  components: {
    TextField,
    Button,
  },
})
export default class SamlLoginComponent extends Vue {
  private error: string | null = '';

  constructor() {
    super();
    this.login();
  }

  doSamlLogin!: () => Promise<LoginResponse>;

  private async login(): Promise<void> {
    const { success, error } = await this.doSamlLogin();
    if (success) {
      this.$router.replace({ name: 'Home' });
      return;
    }

    this.error = error;
  }
}
</script>

<style scoped lang="scss">
.login-wrapper {
  width: 40%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-items: center;
  margin: auto;

  .title {
    padding-bottom: 84px;
    font-family: Dosis-ExtraLight_;
    font-size: 51px;
    font-weight: bold;
    letter-spacing: 0.36px;
    text-align: center;
    color: var(--color-white);
  }

  .input-wrapper {
    width: 100%;
    padding-bottom: 30px;
  }
}
</style>
