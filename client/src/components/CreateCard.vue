
<template>
  <v-row class="fill-height" align-content="start">
    <v-col>
      <v-card
        v-if="!($store.state.activeListCreateCard === this.list._id)"
        @click.stop="activateCardMode"
        @mouseenter="cardHover = true"
        @mouseleave="cardHover = false"
      >Add a card ...</v-card>

      <v-card @click.stop v-else>
        <v-form ref="form" v-model="validCard" @submit.prevent="createCard()">
          <v-text-field
            ref="newCardContent"
            v-model="card.title"
            :rules="notEmptyRules"
            required
            autofocus
            color="primary"
            append-icon="mdi-content-save"
            @click:append="createCard()"
          />
        </v-form>
      </v-card>
    </v-col>
  </v-row>
</template>


<script>
import { notEmptyRules } from '@/validators';
import { mapActions} from 'vuex'

export default {
  name:'create-card',
  props: ['list', 'boardId','createActivity'],
  data: () => ({
    creatingCard: false,
    validCard: false,
    cardHover: true,
    board: {},
    card: {
      title: '',
    },
    notEmptyRules,
  }),
  methods: {
    ...mapActions(['setActiveListCreateCard']),
    activateCardMode() {
      // eslint-disable-next-line
      this.setActiveListCreateCard(this.list._id);
      this.$emit('deactivateCreateMode');
      this.cardHover = false;
    },
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
