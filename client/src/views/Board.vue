<template>
  <v-container>
    <v-slide-y-transition class= "center" mode="out-in">
      <v-layout row align-center wrap>  
        <v-progress-circular v-if="loadingBoard || loadingLists" :size="70" :width="7" indeterminate color="primary"></v-progress-circular>
        <v-flex class="pa-2" sm3 v-for="list in lists" :key="list._id">
          <v-card class="column">
            <v-card-title>{{list.name}}</v-card-title>
            <div>
              <ul v-if= cardsByListId[list._id]>
                <li v-for="card in cardsByListId[list._id]" :key="card._id" >{{card.title}}</li>
              </ul>
            </div>
            <create-card :listId= "list._id" :boardId= "$route.params.id"></create-card>
          </v-card>
        </v-flex>
        <v-form
        v-if="!creatingList"
        v-model="validList"
        @submit.prevent="createList"
        @keydown.prevent.enter>
          <v-card width="250" class="mx-1">
            <v-card-title class="primary lighten-1 white--text align-end" >Create List</v-card-title>
            <v-container>
              <v-text-field v-model= "list.name" :rules="notEmptyRules" label="Name" required></v-text-field>
            </v-container>
            <v-card-actions>
              <v-btn type="submit" :disabled="!validList" class="primary lighten-1 white--text align-end">
                Create
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
import { mapActions, mapState, mapGetters } from 'vuex';
import CreateCard from '../components/CreateCard';
export default {
  name:'list',
  components: {
    CreateCard,
  },
  data: vm => ({
    validList: false,
    board: {},
    list: {
      name: '',
      order: 0,
      archived: false,
    },
    notEmptyRules,
  }),
  mounted() {
    const idBoard = this.$route.params.id //Obliger de passer par la car cela me disait que la variable this.$route.params.id est undefined
    this.getBoard(idBoard)
      .then(Response => {
        console.log(Response);
        this.board = Response.data || Response;
      });
    this.findLists({
      query: {
        boardId: idBoard,
      }
    }).then(Response => {
      const lists = Response.data || Response;
    });
    this.findCards({
      query: {
        boardId: idBoard,
      }
    }).then(Response => {
      const cards = Response.data || Response;
    })
  },
  methods: {
    ...mapActions('boards', { getBoard: 'get' }),
    ...mapActions('lists', { findLists: 'find' }),
    ...mapActions('cards', { findCards: 'find' }),
    createList() {
      if (this.validList) {
        const { List } = this.$FeathersVuex.api;
        this.list.boardId = this.$route.params.id;
        const list = new List(this.list);
        console.log(this.list)
        list.save()
         .then((list) => {
            this.list ={
              name: '',
              order: 0,
              archived: false,
            };
          })
          .catch((err) => {
            console.error(err)
          })
      }
    },
  },
  computed: {
    ...mapState('auth', { user: 'payload' }),
    ...mapState('boards', {
    loadingBoard: 'isGetPending',
    }),
    ...mapState('lists', {
    loadingLists: 'isFindPending',
    creatingList: 'isCreatePending',
    }),
    ...mapGetters('lists', { findListsInStore: 'find'}),
    ...mapGetters('cards', { findCardsInStore: 'find'}),
    lists() {
      return this.findListsInStore({
        query: {
          boardId: this.$route.params.id,
        }
      }).data
    },
    cards() {
      return this.findCardsInStore({
        query: {
          boardId: this.$route.params.id,
        }
      }).data
    },
    cardsByListId() {
      return this.cards.reduce((byId, card) => {
        byId[card.listId] = byId[card.listId] || [];
        byId[card.listId].push(card);
        return byId;
      }, {})
    }
  },
};
</script>
