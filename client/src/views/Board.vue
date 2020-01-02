<template>
  <v-container class="fill-height align-start justify-center" fluid @click="createMode = false">
    <loading-bar v-if="loadingBoard || loadingLists"></loading-bar>
    <v-row>
      <v-col>
        <v-row>
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
              :createActivity="createActivity"
              v-on:activateCreateMode="createMode = true"
            ></create-list>
          </v-col>
        </v-row>
      </v-col>
      <v-col class="transparent" v-if="$store.state.ShowActivities" cols="2">
        <v-card heigth="100%">
          <v-list three-line>
            <v-list-item v-for="activity in activitiesByDate" :key="activity._id">
              <v-list-item-icon>
                <v-icon color="primary">mdi-ticket</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <div v-html="markModify(activity.text)"></div>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>



<script>
import store from "../store/store";
import marked from "marked";
import { notEmptyRules } from "@/validators";
import { mapActions, mapState, mapGetters } from "vuex";
import CreateCard from "../components/CreateCard";
import CreateList from "../components/CreateList";
import LoadingBar from "../components/LoadingBar";
export default {
  name: "list",
  store,
  components: {
    CreateCard,
    CreateList,
    LoadingBar
  },
  data: () => ({
    droppingList: null,
    loadingTest: true,
    draggingCard: null,
    validList: false,
    board: {},
    createMode: false,
    list: {
      name: "",
      order: 0,
      archived: false,
      color: "#FF000000"
    },
    notEmptyRules
  }),
  mounted() {
    const idBoard = this.$route.params.id; //Obliger de passer par la car cela me disait que la variable this.$route.params.id est undefined
    this.getBoard(idBoard).then(Response => {
      this.board = Response.data || Response;
      this.changeBackground();
    });

    this.findLists({
      query: {
        boardId: idBoard
      }
    }).then(Response => {
      const lists = Response.data || Response;
    });
    this.findCards({
      query: {
        boardId: idBoard
      }
    }).then(Response => {
      const cards = Response.data || Response;
    });
    this.findActivities({
      query: {
        boardId: idBoard
      }
    }).then(Response => {
      const activities = Response.data || Response;
    });
  },
  methods: {
    ...mapActions(["setBackground"]),
    changeBackground() {
      this.setBackground(this.board.background);
    },
    ...mapActions("boards", { getBoard: "get" }),
    ...mapActions("lists", { findLists: "find" }),
    ...mapActions("cards", { findCards: "find" }),
    ...mapActions("activities", { findActivities: "find" }),
    async createList() {
      if (this.validList) {
        const { List } = this.$FeathersVuex.api;
        this.list.boardId = this.$route.params.id;
        const list = new List(this.list);
        await list.save().then(list => {
          this.list = {
            name: "",
            order: 0,
            archived: false,
            color: "#FF000000"
          };
          this.createActivity(
            `**${this.user.user.displayName}** created List **${list.name}**`
          );
        });
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
      this.draggingCard = card;
    },
    setDroppingList(event, list) {
      this.droppingList = list;
      event.preventDefault();
    },
    async dropCard() {
      if (this.droppingList) {
        if (this.draggingCard.listId !== this.droppingList._id) {
          const fromList = this.lists.find(
            list => list._id === this.draggingCard.listId
          );
          const toList = this.lists.find(
            list => list._id === this.droppingList._id
          );
          this.draggingCard.listId = this.droppingList._id;
          await this.draggingCard.save();
          this.createActivity(
            `**${this.user.user.displayName}** moved card **${this.draggingCard.title}** from **${fromList.name}** to **${toList.name}**`
          );
        }
      }
      this.droppingList = null;
      this.draggingCard = null;
    },
    markModify(text) {
      return marked(text);
    }
  },
  computed: {
    ...mapState("auth", { user: "payload" }),
    ...mapState("lists", {
      loadingLists: "isFindPending",
      creatingList: "isCreatePending",
      listsError: "errorOnfind"
    }),
    ...mapState("activities", {
      loadingActivities: "isFindPending",
      creatingActivity: "isCreatePending"
    }),
    ...mapState("cards", {
      cardsError: "errorOnfind"
    }),
    ...mapGetters("lists", { findListsInStore: "find" }),
    ...mapGetters("cards", { findCardsInStore: "find" }),
    ...mapGetters("activities", { findActivitiesInStore: "find" }),
    activities() {
      return this.findActivitiesInStore({
        query: {
          boardId: this.$route.params.id
        }
      }).data;
    },
    lists() {
      return this.findListsInStore({
        query: {
          boardId: this.$route.params.id
        }
      }).data;
    },
    cards() {
      return this.findCardsInStore({
        query: {
          boardId: this.$route.params.id
        }
      }).data;
    },
    cardsByListId() {
      return this.cards.reduce((byId, card) => {
        byId[card.listId] = byId[card.listId] || [];
        byId[card.listId].push(card);
        return byId;
      }, {});
    },
    activitiesByDate() {
      return this.activities.slice().reverse();
    }
  }
};
</script>
<style scoped>
.transparent {
  background-color: #009688 !important;
  opacity: 0.65;
  border-color: transparent !important;
}
.transparentbis {
  opacity: 0.65;
  border-color: transparent !important;
}
</style>
