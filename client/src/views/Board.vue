<template>
  <v-container fluid grid-list-lg>
      <v-progress-circular
        v-if="loadingBoard || loadingLists"
        :size="70"
        :width="7"
        indeterminate
        color="primary">
      </v-progress-circular>
      <v-flex xs12 v-if="boardsError">
        <v-alert  type="error">
          {{boardsError.message}}
        </v-alert>
      </v-flex>
      <v-flex xs12 v-if="!boardsError">
        <v-layout row wrap>
          <v-flex xs12>
            <h2 v-if="board">{{board.name}}</h2>
          </v-flex>
          <v-flex sm3 v-for="list in lists" :key="list._id" pa-1>
            <v-layout row wrap>
              <v-flex>
                <v-card :color="list.color" @dragover="setDroppingList($event, list)" :class="{ 'teal lighten-4': droppingList == list }" v-if="!boardsError">
                  <v-card-title>
                    <v-layout column>
                      <v-flex>
                        <div class="headline">{{list.name}}</div>
                      </v-flex>
                      <v-flex pa-1
                        v-if= cardsByListId[list._id]
                        v-for="card in cardsByListId[list._id]" 
                        :key="card._id">
                        <v-card draggable="true" @dragstart="startDraggingCard(card)" @dragend="dropCard()">
                          <v-container fluid grid-list-lg>
                            <v-layout row>
                              <v-flex xs12>
                                <div>
                                  <div class="headline">{{card.title}}</div>
                                </div>
                              </v-flex>
                            </v-layout>
                          </v-container>
                        </v-card>
                      </v-flex>
                    </v-layout>
                  </v-card-title>
                  <v-card-actions>
                    <create-card :listId= "list._id" :boardId= "$route.params.id"></create-card>
                  </v-card-actions>
                </v-card>
              </v-flex>
            </v-layout>
          </v-flex>
        </v-layout>
      </v-flex>
      <v-form
      v-if="!creatingList && !boardsError"
      v-model="validList"
      @submit.prevent="createList"
      @keydown.prevent.enter>
        <v-card width="250" class="mx-1">
          <v-card-title class="primary lighten-1 white--text align-end" >Create List</v-card-title>
          <v-container>
            <v-text-field v-model= "list.name" :rules="notEmptyRules" label="Name" required></v-text-field>
            <v-expansion-panels>
              <v-expansion-panel>
                <v-expansion-panel-header>
                  Color
                  <v-row justify="space-around">
                    <v-avatar :color="list.color">
                    </v-avatar>
                  </v-row>
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <v-color-picker v-model="list.color" flat mode="hex" canvas-height="100" hide-inputs></v-color-picker>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-container>
          <v-card-actions>
            <v-btn type="submit" :disabled="!validList" class="primary lighten-1 white--text align-end">
              Create
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
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
    droppingList: null,
    draggingCard: null,
    validList: false,
    board: {},
    list: {
      name: '',
      order: 0,
      archived: false,
      color:'#FF000000',
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
              color:'#FF000000',
            };
          })
          .catch((err) => {
            console.error(err)
          })
      }
    },
    startDraggingCard(card) {
      this.draggingCard = card
    },
    setDroppingList(event, list) {
      this.droppingList = list
      event.preventDefault();
    },
    dropCard() {
      if (this.droppingList) {
        this.draggingCard.listId = this.droppingList._id;
        this.draggingCard.save();
      };
      this.droppingList = null;
      this.draggingCard = null
    },
  },
  computed: {
    ...mapState('auth', { user: 'payload' }),
    ...mapState('boards', {
    loadingBoard: 'isGetPending',
    boardsError: 'errorOnGet',
    }),
    ...mapState('lists', {
    loadingLists: 'isFindPending',
    creatingList: 'isCreatePending',
    listsError: 'errorOnfind',
    }),
    ...mapState('cards', {
    cardsError: 'errorOnfind',
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
