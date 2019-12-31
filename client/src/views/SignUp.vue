 
<template>
  <v-container fluid>
    <v-form v-model="valid" @submit.prevent="signUp" @keydown.prevent.enter>
      <v-card class="mx-auto" max-width="400">
        <v-toolbar
          flat
          color="primary lighten-1 text-center"
          class="white--text"
        >
          <v-icon class="white--text">mdi-account-plus</v-icon>
          <v-toolbar-title mr class="mx-3 font-weight-light">User Signup</v-toolbar-title>
        </v-toolbar>
        <v-container v-if="!loading">
          <v-text-field
            v-model="user.username"
            :rules="notEmptyRules"
            label="Username"
            required
          ></v-text-field>
          <v-spacer></v-spacer>
          <v-text-field
            v-model="user.displayName"
            :rules="notEmptyRules"
            label="Display Name"
            required
          ></v-text-field>
          <v-text-field
            v-model="user.password"
            :rules="notEmptyRules"
            label="Password"
            type="password"
            required
          ></v-text-field>
          <v-text-field
            v-model="user.confirmPassword"
            :rules="confirmPasswordRules"
            label="Confirm Password"
            type="password"
            required
          ></v-text-field>
          <v-text-field
            v-model="user.imageUrl"
            :rules="notEmptyRules"
            label="Image Url"
            required
          ></v-text-field>
          <v-btn type="submit" :disabled="!valid">SignUp</v-btn>
        </v-container>
        <v-progress-circular
          v-if="loading"
          :size="70"
          :width="7"
          indeterminate
          color="primary"
        ></v-progress-circular>
      </v-card>
    </v-form>
  </v-container>
</template>

<script>
import { mapState } from 'vuex';
import { notEmptyRules } from '@/validators';
export default {
  name: 'signUp',
  data: vm => ({
    valid: false,
    user: {
      username: '',
      password: '',
      confirmPassword: '',
      displayName: '',
      imageUrl: '',
    },
    notEmptyRules,
    confirmPasswordRules: [confirmPassword => confirmPassword === vm.user.password || 'Password must match.'],
  }),
  computed: {
    ...mapState('users', { loading: 'isCreatePending' }),
  },
  methods: {
    signUp() {
      if (this.valid) {
        const { User } = this.$FeathersVuex.api;
        const user = new User(this.user);
        user.save()
          .then((user) => {
            this.$router.push('/login');
          });
      }
    },
  },
};
</script>
