<template>
  <v-app>
    <v-app-bar app>
      <v-toolbar-title class="headline text-uppercase">
        <span>Vuetify</span>
        <span class="font-weight-light">MATERIAL DESIGN</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>

      <!--<v-btn v-if="showLogin" :to="{name:'login'}">Login</v-btn>-->
      <v-btn v-if="showSignUp" :to="{name:'signup'}">SingUp</v-btn>

      <createBoard v-if="this.$route.path === '/boards'"></createBoard>
      <v-btn v-if="showLogout" @click="logout">Logout</v-btn>
    </v-app-bar>
    <v-content>
      <router-view />
    </v-content>
  </v-app>
</template>

<script>
import store from "./store/store";
import { mapActions, mapMutations } from "vuex";

function ifLogin(store, data) {
  store
    .dispatch("auth/authenticate")
    .then(() => {
      console.log("!!!!!!!!!=============1ere45 already login");
      data.showLogin = false;
      data.showSignUp = false;
      data.showLogout = true;
    })
    .catch(() => {
      console.log("=============1ere45 no login");
      data.showSignUp = true;
      data.showLogout = false;
    });
}

export default {
  name: "App",
  components: {
  },

  data: vm => ({
    //
    showLogin: false,
    showSignUp: false,
    showLogout: true
  }),
  updated() {
    ifLogin(this.$store, this.$data);
    console.log("aaaaaaaa");
  },
  methods: {
    ...mapActions("auth", { authLogout: "logout" }),
    ...mapActions("auth", { authenticate: "authenticate" }),
    logout() {
      this.authLogout()
        .then(() => {
          console.log("======12386===== logout success");
          this.$data.showLogin = true;
          this.$data.showSignUp = true;
          this.$data.showLogout = false;
          this.$router.push("/login");
        })
        .catch(e => {
          // Show login page (potentially with `e.message`)
          console.error("Authentication error", e);
        });
    }
  }
};
</script>
