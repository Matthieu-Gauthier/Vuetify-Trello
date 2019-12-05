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
            <v-card-title class="primary lighten-1 white--text align-end" >Create Card</v-card-title>
            <v-container>
              <v-text-field v-model= "card.title" :rules="notEmptyRules" label="Title" required></v-text-field>
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
  props: ['listId', 'boardId'],
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
    createCard() {
      if (this.validCard) {
        const { Card } = this.$FeathersVuex.api;
        this.card.boardId = this.boardId;
        this.card.listId = this.listId;
        const card = new Card(this.card);
        this.creatingCard = true;
        card.save()
         .then((card) => {
            setTimeout(() => {
              this.creatingCard = false;
            }, 1000);
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
