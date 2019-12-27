<template>
  <v-container
    fill-height
    fluid
    :style="'background-image: url('+board.background+'); background-size:cover;'"
  >
    <loading-bar v-if="loadingBoard || loadingLists"></loading-bar>
    <v-row class="fill-height" align-content="start">
      <v-col
        cols="12"
        xl="2"
        lg="2"
        md="6"
        sm="12"
        xs="12"
        v-for="list in lists"
        :key="list._id"
      >
        <v-card
          class="transparent"
          color="primary"
          @dragover="setDroppingList($event, list)"
          :class="{ 'teal lighten-4': droppingList == list }"
          v-if="!boardsError"
        >
          <v-card-title class="white--text">{{list.name}}</v-card-title>
          <v-container>
            <v-row align-content="start">
              <v-col>
                <v-card
                  class="ma-1"
                  v-if="cardsByListId[list._id]"
                  v-for="card in cardsByListId[list._id]"
                  :key="card._id"
                  draggable="true"
                  @dragstart="startDraggingCard(card)"
                  @dragend="dropCard()"
                >
                  <div class="headline">{{card.title}}</div>
                </v-card>
                <v-card-actions>
                  <create-card
                    :createActivity="createActivity"
                    :list="list"
                    :boardId="$route.params.id"
                  ></create-card>
                </v-card-actions>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-col>
      <v-col align-self="start" cols="12" xl="2" lg="2" md="6" sm="12" xs="12">
        <create-list
          :createMode="createMode"
          v-on:activateCreateMode="createMode = true"
        ></create-list>
      </v-col>
    </v-row>
  </v-container>
</template>



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
    droppingList: null,
    loadingTest:true,
    draggingCard: null,
    validList: false,
    ShowActivities: true,
    board: {},
    createMode: false,
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
    async createList() {
      if (this.validList) {
        const { List, Activity } = this.$FeathersVuex.api;
        this.list.boardId = this.$route.params.id;
        const list = new List(this.list);
        console.log(this.list)
        await list.save()
         .then((list) => {
            this.list ={
              name: '',
              order: 0,
              archived: false,
              color:'#FF000000',
            };
            this.createActivity(`**${this.user.user.displayName}** created List **${list.name}**`)
          })
          .catch((err) => {
            console.error(err)
          })
      }
    },
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
      }
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
<style scoped>
.transparent {
  background-color: #009688 !important;
  opacity: 0.65;
  border-color: transparent !important;
}
</style>
