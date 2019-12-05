<template>
  <v-container>
    <v-slide-y-transition class= "center" mode="out-in">
      <v-layout column align-center>
        <v-card v-if="!loading" max-width="500" max-height="500" min-width="300" min-height="300" class="overflow-hidden" >
          <v-toolbar flat color="primary lighten-1 text-center" class="white--text">
            <v-icon class="white--text">mdi-account </v-icon>
            <v-toolbar-title class="mx-3 font-weight-light">User Profile</v-toolbar-title>
          </v-toolbar>
          <v-spacer></v-spacer>
            <v-form
              v-model="valid"
              @submit.prevent="login({ valid, user })"
              @keydown.prevent.enter
            >
              <v-card-text>
                <v-text-field v-model="user.username" :rules="notEmptyRules" label="Username" required></v-text-field>
                <v-text-field
                  v-model="user.password"
                  :rules="notEmptyRules"
                  label="Password"
                  type="password"
                  required
                ></v-text-field>
                <v-btn type="submit" :disabled="!valid">Login</v-btn>
              </v-card-text>
            </v-form>
            <v-alert v-if="WrongLogin" type="error" dismissible>
              "Please input correct username and password !"
            </v-alert>
          </v-card>
        <v-progress-circular v-if="loading" :size="70" :width="7" indeterminate color="primary"></v-progress-circular>
      </v-layout>
    </v-slide-y-transition>
  </v-container>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { notEmptyRules } from '@/validators';
export default {
  name: "login",
  data: () => ({
    valid: false,
    WrongLogin: false,
    user: {
      username: "",
      password: ""
    },
    notEmptyRules,
  }),
  computed: {
    ...mapState("auth", { loading: "isAuthenticatePending" })
  },
  methods: {
      ...mapActions('auth',['authenticate']),
    async login() {
      this.authenticate({
        strategy: "local",
        ...this.user,
      })
        .then(async () => {
          // Login ok
          await this.authenticate();
          this.$router.push("/boards")
        })
        .catch(err => {
          // Show login page (potentially with `e.message`)
          this.WrongLogin = true
        });
    },
    resetWrongLogin() {

      this.WrongLogin = false
    }

  }
};
</script>
