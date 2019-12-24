<template>
  <v-container
  fluid
  fill-heigh
  :style="'background-image: url('+board.background+'); background-size:cover;'"
  >
      <!-- <v-flex xs10 pa-3 v-if="boardsError">
        <v-alert  type="error">
          {{boardsError.message}}
        </v-alert>
      </v-flex> -->
      <loading-bar v-if="loadingBoard || loadingLists"></loading-bar>
      <v-row
        v-if="!boardsError">
        <v-col cols=12>
          <v-text-field
            class="headline mb-0"
            v-model="board.name"
            :rules="[notEmptyRules]"
            label="Name"
            required
            :loading="loadingBoard"
          >            
          <v-progress-linear
              slot="progress"
              height="2"
              indeterminate
              color="primary"
            />
          </v-text-field>
        </v-col>
        <v-col v-for="list in lists" :key="list._id"
        xl=2 md=4 sm=6 xs=12>
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
              <create-card 
                :createActivity = "createActivity"
                :list= "list" 
                :boardId= "$route.params.id">
              </create-card>
            </v-card-actions>
          </v-card>
        </v-col>
        <v-col xl=2 md=4 sm=6 xs=12 align-self=end>
          <create-list 
            :createActivity = "createActivity">
          </create-list>
        </v-col>
      </v-row>
  </v-container>
</template>
          // <v-flex xs2 >
          //    <v-navigation-drawer
          //     fixed
          //     clipped
          //     absolute
          //     color: secondary
          //     v-if="ShowActivities"
          //     right>
          //     <v-card heigth="100%" flat>
          //       <v-list three-line>
          //         <v-list-item v-for="activity in activitiesByDate" :key="activity._id">
          //           <v-list-item-icon>
          //             <v-icon color="primary">mdi-ticket</v-icon>
          //           </v-list-item-icon>
          //           <v-list-item-content>
          //             <v-list-item-sub-title v-html="markModify(activity.text)"></v-list-item-sub-title>
          //           </v-list-item-content>
          //         </v-list-item>
          //       </v-list>
          //     </v-card>
          //   </v-navigation-drawer>
          // </v-flex>
<script>
import marked from 'marked';
import { notEmptyRules } from '@/validators';
import { mapActions, mapState, mapGetters } from 'vuex';
import CreateCard from '../components/CreateCard';
import CreateList from '../components/CreateList';
import LoadingBar from '../components/LoadingBar';
export default {
  name:'list',
  components: {
    CreateCard,
    CreateList,
    LoadingBar,
  },
  data: vm => ({
    loadingTest: true,
    droppingList: null,
    draggingCard: null,
    validList: false,
    ShowActivities: true,
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
      this.findActivities({
      query: {
        boardId: idBoard,
      }
    }).then(Response => {
      const activities = Response.data || Response;
    });
  },
  methods: {
    ...mapActions('boards', { getBoard: 'get' }),
    ...mapActions('lists', { findLists: 'find' }),
    ...mapActions('cards', { findCards: 'find' }),
    ...mapActions('activities', { findActivities: 'find' }),
    async createActivity(text) {
      const { Activity } = this.$FeathersVuex.api;
      const activity = new Activity();
      activity.text = text;
      activity.boardId = this.$route.params.id;
      activity.userId = this.user.userId;
      await activity.save();
    },
    startDraggingCard(card) {
      this.draggingCard = card
    },
    setDroppingList(event, list) {
      this.droppingList = list
      event.preventDefault();
    },
    async dropCard() {
      if (this.droppingList) {
        if (this.draggingCard.listId !== this.droppingList._id){
          const fromList = this.lists.find(list => list._id === this.draggingCard.listId)
          const toList = this.lists.find(list => list._id === this.droppingList._id)
          this.draggingCard.listId = this.droppingList._id;
          await this.draggingCard.save();
          this.createActivity(`**${this.user.user.displayName}** moved card **${this.draggingCard.title}** from **${fromList.name}** to **${toList.name}**`)
        }
      };
      this.droppingList = null;
      this.draggingCard = null
    },
    markModify(text) {
      return marked(text);
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
      ...mapState('activities', {
      loadingActivities: 'isFindPending',
      creatingActivity: 'isCreatePending',
      }),
    ...mapState('cards', {
    cardsError: 'errorOnfind',
    }),
    ...mapGetters('lists', { findListsInStore: 'find'}),
    ...mapGetters('cards', { findCardsInStore: 'find'}),
    ...mapGetters('activities', { findActivitiesInStore: 'find'}),
    activities() {
        return this.findActivitiesInStore({
        query: {
          boardId: this.$route.params.id,
        }
      }).data
    },
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
    },
    activitiesByDate() {
      return this.activities.slice().reverse()
    },
  },
};
</script>
