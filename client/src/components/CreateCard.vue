<template>
  <v-container fluid>
    <v-layout row wrap>
      <v-flex xs12>
        <v-form
        v-if="!creatingCard"
        v-model="validCard"
        @submit.prevent="createCard"
        @keydown.prevent.enter>
          <v-card>
            <v-container>
              <v-text-field v-model= "card.title" :rules="notEmptyRules" label="Title card" required></v-text-field>
            </v-container>
            <v-card-actions>
              <v-btn type="submit" :disabled="!validCard" class="primary lighten-1 white--text align-end">
                Create Card
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-form>
      </v-flex>
      <v-progress-circular align-center
        v-if="creatingCard"
        :size="70"
        :width="7"
        indeterminate
        color="primary">
      </v-progress-circular>
    </v-layout>
  </v-container>
</template>

<script>
import { notEmptyRules } from '@/validators';
import { mapActions, mapState, mapGetters } from 'vuex'

export default {
  name:'create-card',
  props: ['list', 'boardId','createActivity'],
  data: () => ({
    creatingCard: false,
    validCard: false,
    board: {},
    card: {
      title: '',
      members: [],
    },
    notEmptyRules,
  }),
  methods: {
    async createCard() {
      if (this.validCard) {
        const { Card, Activity } = this.$FeathersVuex.api;
        this.card.boardId = this.boardId;
        this.card.listId = this.list._id;
        const card = new Card(this.card);
        this.creatingCard = true;
        await card.save()
         .then((card) => {
            setTimeout(() => {
              this.creatingCard = false;
            }, 1000);
            this.createActivity(`**${this.$store.state.auth.user.displayName}** created card **${this.card.title}** from list **${this.list.name}**`)
            this.card ={
              title: '',
              members: [],
            };
          })
          .catch((err) => {
            console.error(err)
          })
      }
    },
  },
};
</script>
