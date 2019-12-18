<template>
  <v-container>
      <v-layout row align-center wrap pa-2>  
        <v-progress-circular v-if="loading" :size="70" :width="7" indeterminate color="primary"></v-progress-circular>
        <v-flex class="pa-2" v-if="!loading" sm3 v-for="board in boards" :key="board._id">
          <v-card class="column">
            <v-img class="white--text align-end" max-height="250px" :src="board.background">
              <v-card-title>{{board.name}}</v-card-title>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn :to="{ name: 'board', params: { id: board._id } }" icon>
                  <v-icon class="white--text align-end" >mdi-arrow-right-bold-circle</v-icon>
                </v-btn>
              </v-card-actions>
            </v-img>
          </v-card>
        </v-flex>
      </v-layout>
        <v-flex pa-2 sm3 mx-auto>
          <!-- <v-form 
          v-if="!creating"
          v-model="valid"
          @submit.prevent="createBoard"
          @keydown.prevent.enter>
            <v-card>
              <v-card-title class="primary lighten-1 white--text align-end" >Create Board</v-card-title>
              <v-container>
                <v-text-field v-model= "board.name" :rules="notEmptyRules" label="Name" required></v-text-field>
                <v-text-field v-model= "board.background" :rules="notEmptyRules" label="Background" required></v-text-field>
              </v-container>
              <v-card-actions>
                <v-btn type="submit" :disabled="!valid" class="primary lighten-1 white--text align-end">
                  Create
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-form> -->
          <create-board> </create-board>
        </v-flex>
  </v-container>
</template>

export default {
  name:'list',

<script>
import { notEmptyRules } from '@/validators';
import { mapActions, mapState, mapGetters } from 'vuex'
import CreateBoard from '../components/CreateBoard';
export default {
  name:'boards',
  components: {
      CreateBoard,
  },
  data: vm => ({
    valid: false,
    board: {
      name: '',
      background: '',
      memberIds: [],
    },
    notEmptyRules,
  }),
  mounted() {
    this.findBoards({ query: {} })
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
        console.log(this.board)
        board.save()
         .then((board) => {
            this.board ={
              name: '',
              background: '',
              memberIds: [],
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
      loading: 'isFindPending',
      creating: 'isCreatePending',
      }),
    ...mapGetters('boards', { findBoardsInStore: 'find'}),
    boards () {
      return this.findBoardsInStore({
        query:{
          ownerId: this.user.user._id,
        } }).data;
    }
  }
};
</script>
