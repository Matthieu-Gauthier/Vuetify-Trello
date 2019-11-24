<template>
  <v-container>
    <v-slide-y-transition class= "center" mode="out-in">
      <v-layout column align-center>
        <v-card max-width="500" max-height="500" min-width="300" min-height="300" class="overflow-hidden">
          <v-toolbar flat color="primary lighten-1 text-center" class="white--text">
            <v-icon class="white--text"> mdi-account</v-icon>
            <v-toolbar-title class="font-weight-light">User Profile</v-toolbar-title>
          </v-toolbar>
          <v-spacer></v-spacer>
            <v-form
              v-if="!loading"
              v-model="valid"
              @submit.prevent="login({ valid, userinfo })"
              @keydown.prevent.enter
            >
              <v-card-text>
                <v-text-field v-model="userinfo.username" :rules="notEmptyRules" label="Username" required></v-text-field>
                <v-text-field
                  v-model="userinfo.password"
                  :rules="notEmptyRules"
                  label="Password"
                  type="password"
                  required
                ></v-text-field>
                <v-btn type="submit" :disabled="!valid">Login</v-btn>
              </v-card-text>
            </v-form>
          </v-card>
        <v-progress-circular v-if="loading" :size="70" :width="7" indeterminate color="primary"></v-progress-circular>
      </v-layout>
    </v-slide-y-transition>
  </v-container>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { notEmptyRules } from "validators";
export default {
  name: "login",
  data: () => ({
    valid: false,
    userinfo: {
      username: "",
      password: ""
    },
    notEmptyRules
  }),
  computed: {
    ...mapState("auth", { loading: "isAuthenticatePending" })
  },
  methods: {
      ...mapActions('auth',['authenticate']),
    login() {
      this.authenticate({
        strategy: "local",
        username: this.userinfo.username,
        password: this.userinfo.password
      })
        .then(() => {
          // Logged in
  
          this.$router.push("/boards")
        })
        .catch(err => {
            
          // Show login page (potentially with `e.message`)
          alert("please input correct username and password")
          console.error("Authentication error", err);
        });
    }
    //...mapActions('localAuth', ['login']),
  }
};
</script>
