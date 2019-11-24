<template>
  <v-app>
    <v-app-bar class= "primary lighten-1 text-center" app>
      <v-toolbar-title class="headline">
        <span class="white--text">Vuetify-Trello</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn v-if="showSignUp" :to="{name:'signup'}">SignUp</v-btn>
      <createBoard v-if="this.$route.path === '/boards'"></createBoard>
      <v-btn v-if="showLogout" @click="logout">Logout</v-btn>
    </v-app-bar>
    <v-content>
     <router-view></router-view>
    </v-content>
    <v-footer
      :padless="true">
      <v-card
        flat
        tile
        width="100%"
        class="primary lighten-1 text-center">
        <v-card-text class="white--text">
          {{ new Date().getFullYear() }} — <strong>Made by Got </strong>
        </v-card-text>
      </v-card>
    </v-footer>
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
