<template>
  <v-app>
    <v-app-bar class= "primary lighten-1 text-center" app>
      <v-toolbar-title class="headline">
        <span class="white--text">Vuetify-Trello</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn class="mx-1" v-if="showSignUp" :to="{name:'signup'}">SignUp</v-btn>
      <v-btn class="mx-1" v-if="showLogin" :to="{name:'login'}">Login</v-btn>
      <v-avatar>
        <img v-if="user" :src="user.user.imageUrl">
      </v-avatar>
      <v-btn class="mx-2" v-if="showLogout" @click="logout" text color="white">Logout</v-btn>
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
import { mapActions, mapMutations, mapState } from "vuex";

function ifLogin(store, data) {
  store
    .dispatch("auth/authenticate")
    .then(() => {
      data.showLogin = false;
      data.showSignUp = false;
      data.showLogout = true;
    })
    .catch(() => {
      data.showSignUp = true;
      data.showLogout = false;
    });
}

export default {
  name: "App",
  components: {
  },
  computed: {
    ...mapState('auth', { user: 'payload' }),
  },
  data: vm => ({
    showLogin: false,
    showSignUp: false,
    showLogout: true
  }),
  updated() {
    ifLogin(this.$store, this.$data);
    console.log(this.$store);
  },
  methods: {
    ...mapActions("auth", { authLogout: "logout" }),
    ...mapActions("auth", { authenticate: "authenticate" }),
    logout() {
      this.authLogout()
        .then(() => {
          this.$data.showLogin = true;
          this.$data.showSignUp = true;
          this.$data.showLogout = false;
          this.$router.push("/login");
        })
        .catch(e => {
          // Show login page (potentially with `e.message`)
          console.error("Logout error", e);
        });
    }
  }
};
</script>
