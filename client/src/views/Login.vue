<template>
  <v-container fluid>
    <v-slide-y-transition mode="out-in">
      <v-layout column align-center>
        <v-form
          v-if="!loading"
          v-model="valid"
          @submit.prevent="login({ valid, userinfo })"
          @keydown.prevent.enter
        >
          <v-text-field v-model="userinfo.username" :rules="notEmptyRules" label="Username" required></v-text-field>
          <v-text-field
            v-model="userinfo.password"
            :rules="notEmptyRules"
            label="Password"
            type="password"
            required
          ></v-text-field>
          <v-btn type="submit" :disabled="!valid">Login</v-btn>
        </v-form>
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
