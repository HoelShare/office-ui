<template>
  <div class="login-wrapper">
    <h1 class="title">Login</h1>
    <TextField v-model="username" />
    <TextField v-model="password" type="password" />
    <div v-if="error">{{ error }}</div>
    <Button @click="doLogin" type="primary">Login</Button>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { mapActions } from 'vuex';
import Button from '@/components/Button.vue';
import TextField from '@/components/TextField.vue';
import { LoginForm } from '@/interfaces/Login';

@Component({
  methods: mapActions(['login']),
  components: {
    TextField,
    Button,
  },
})
export default class LdapLoginComponent extends Vue {
  private error: string | null = '';

  private username = '';

  private password = '';

  login!: (
    form: LoginForm
  ) => Promise<{ success: boolean; error: string | null }>;

  private async doLogin(): Promise<void> {
    if (this.username === '' || this.password === '') {
      return;
    }

    this.error = null;
    const { success, error } = await this.login({
      username: this.username,
      password: this.password,
    });

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
