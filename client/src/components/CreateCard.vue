<template>
  <v-container>
    <v-slide-y-transition class= "center" mode="out-in">
      <v-layout row align-center wrap>  
        <v-form
        v-if="!creatingCard"
        v-model="validCard"
        @submit.prevent="createCard"
        @keydown.prevent.enter>
          <v-card width="250" class="mx-1">
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
      </v-layout>
    </v-slide-y-transition>
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
    computed: {
    ...mapState('auth', { user: 'payload' }),
    ...mapState('cards', {
      creatingCard: 'isCreatePending',
    }),
  },
  methods: {
    createCard() {
      if (this.validCard) {
        const { Card } = this.$FeathersVuex.api;
        this.card.boardId = this.boardId;
        this.card.listId = this.listId;
        const card = new Card(this.card);
        console.log(this.card)
        card.save()
         .then((card) => {
            console.log(card)
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
