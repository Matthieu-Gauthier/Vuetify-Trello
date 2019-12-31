<template>
  <v-container fluid @click="createMode = false">
    <loading-bar v-if="loading"></loading-bar>
    <v-row v-if="!loading" align="start" justify="start">
      <v-col
        cols="12"
        xl="2"
        lg="2"
        md="6"
        sm="12"
        xs="12"
        v-for="board in boards"
        :key="board._id"
      >
        <v-card>
          <v-img
            class="white--text align-end"
            min-height="200px"
            max-height="200px"
            :src="board.background"
          >
            <v-card-title>{{board.name}}</v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn :to="{ name: 'board', params: { id: board._id } }" icon>
                <v-icon
                  class="white--text align-end"
                >mdi-arrow-right-bold-circle</v-icon>
              </v-btn>
            </v-card-actions>
          </v-img>
        </v-card>
      </v-col>
      <v-col align-self="start" cols="12" xl="2" lg="2" md="6" sm="12" xs="12">
        <create-board
          :createMode="createMode"
          v-on:activateCreateMode="createMode = true"
          v-on:desactivateCreateMode="createMode = false"
        ></create-board>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { notEmptyRules } from '@/validators';
import { mapActions, mapState, mapGetters } from 'vuex'
import CreateBoard from '../components/CreateBoard';
import LoadingBar from '../components/LoadingBar';

export default {
  name:'boards',
  components: {
      CreateBoard,
      LoadingBar,
  },
  data: () => ({
    valid: false,
    createMode:false,
    board: {
      name: '',
      background: '',
      memberIds: [],
    },
    notEmptyRules,
  }),
  mounted() {
     this.findBoards()
       .then(Response => {
         const boards = Response.data || Response;
       })
   },
  methods: {
    ...mapActions('boards', { findBoards: 'find' }),
    createBoard() {
      if (this.valid) {
        const { Board } = this.$FeathersVuex.api;
        const board = new Board(this.board);
        board.save()
         .then( ()=> {
            this.board ={
              name: '',
              background: '',
              memberIds: [],
            };
          })
      }
    },
  },
  computed: {
    ...mapState('auth', { user: 'payload' }),
    ...mapState('boards', {
      loading: 'isFindPending',
      creating: 'isCreatePending',
      }),
    ...mapGetters('boards', { findBoardsInStore: 'find'}),
    boards() {
      return this.findBoardsInStore().data;
    }
  }
};
</script>