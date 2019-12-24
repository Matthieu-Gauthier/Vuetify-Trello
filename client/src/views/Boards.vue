<template>
  <v-container fluid>
    <v-progress-circular v-if="loading" :size="70" :width="7" indeterminate color="primary"></v-progress-circular>
    <v-row >
      <v-col v-if="!loading" v-for="board in boards" :key="board._id"
      xl=2 md=4 sm=6 xs=12 
      >
        <v-card>
            <v-img class="white--text align-end" height="250px" :src="board.background">
              <v-card-title>{{board.name}}</v-card-title>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn :to="{ name: 'board', params: { id: board._id } }" icon>
                  <v-icon class="white--text align-end" >mdi-arrow-right-bold-circle</v-icon>
                </v-btn>
              </v-card-actions>
            </v-img>
          </v-card>
      </v-col>
      <v-col xl=2 md=4 sm=6 xs=12 align-self=end>
          <create-board></create-board>
      </v-col >
    </v-row>
  </v-container>
</template>

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
