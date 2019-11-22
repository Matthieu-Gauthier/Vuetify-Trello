 
<template>
<v-container fluid>
      <v-form
        v-model="valid"
        @submit.prevent="signUp"
        @keydown.prevent.enter>
        <v-card
         class="mx-auto"
            max-width="600">
            <v-img
              class="primary--text align-end"
              height="100px"
              src="https://media.istockphoto.com/vectors/welcome-poster-with-brush-strokes-vector-id940891868?k=6&m=940891868&s=612x612&w=0&h=awJY_W7nGybC5pRtygpA3QBoNc2TSG4ZFKdGzMbQfUI="
            >
            </v-img>
          <v-container v-if="!loading">
            <v-text-field
              v-model= "user.username"
              :rules= "notEmptyRules"
              label="Username"
              required>
            </v-text-field>
            <v-spacer></v-spacer>
            <v-text-field
              v-model= "user.displayName"
              :rules= "notEmptyRules"
              label="Display Name"
              required>
            </v-text-field>
            <v-text-field
              v-model= "user.password"
              :rules= "notEmptyRules"
              label="Password"
              type="password"
              required>
            </v-text-field>
            <v-text-field
              v-model= "user.confirmPassword"
              :rules= "confirmPasswordRules"
              label="Confirm Password"
              type="password"
              required>
            </v-text-field>
            <v-text-field
              v-model= "user.imageUrl"
              :rules= "notEmptyRules"
              label="Image Url"
              required>
            </v-text-field>
            <v-btn type="submit" :disable="!valid">SignUp</v-btn>
          </v-container>
          <v-progress-circular
            v-if="loading"
            :size="70"
            :width="7"
            indeterminate
            color="primary">
          </v-progress-circular>
        </v-card>
    </v-form>
  </v-container>
</template>

<script>
import { mapState } from 'vuex';
import { notEmptyRules } from 'validators';
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
        console.log("=========12312=======",this.user)
        user.save()
          .then((user) => {
            console.log(user);
            this.$router.push('/login');
          });
      }
    },
  },
};
</script>
