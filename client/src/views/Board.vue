<template>
  <v-container>
    <v-slide-y-transition class= "center" mode="out-in">
      <v-layout row align-center wrap>  
        <v-progress-circular v-if="loadingBoard || loadingLists" :size="70" :width="7" indeterminate color="primary"></v-progress-circular>
        <v-flex xs12>
          <h2>{{board.name}}</h2>
        </v-flex>
        <v-flex class="pa-2" sm3 v-for="list in lists" :key="list._id">
          <v-card class="column">
            <v-card-title>{{list.name}}</v-card-title>
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
                Create List
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
  name:'list',
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
    this.getBoard(this.$route.params.id)
      .then(Response => {
        this.board = Response.data || Response;
      });
    this.findLists({
      query: {
        boardId: this.$$route.params.id
      }
    }).then(response => {
      const lists = response.data || response;
    })
  },
  methods: {
    ...mapActions('boards', { getBoard: 'get' }),
    ...mapActions('lists', { findLists: 'find' }),
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
    ...mapState('boards', {
      loadingBoard: 'isGetPending',
      }),
      ...mapState('lists', {
      loadingLists: 'isFindPending',
      creatingList: 'isCreatePending',
      }),
      ...mapGetters('lists', { findListsInStore: 'find'}),
      lists() {
        return this.findListsInStore({
          query: {
            boardId: this.$route.params.id
          }
        }).data
      },
  },
};
</script>
