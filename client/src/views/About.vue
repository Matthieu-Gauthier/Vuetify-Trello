<template>
  <v-container fill-height>
    <v-row align="start">
      <v-col cols="6">
        <span>boards</span>
        <pre>
          {{boards}}
          </pre>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="6">
        <span>boardsMoto</span>
        <pre>
          {{boardsMoto}}
          </pre>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions, mapState, mapGetters } from 'vuex'

export default {
  name:'boardsMoto',
  data: vm => ({
    board: {
      name: '',
      background: '',
      memberIds: [],
    },
    boardsmounted:[]
  }),
    mounted() {
    this.findBoards({ query: {name:"Moto"} })
      .then(Response => {
         this.boardsmounted = Response.data || Response;
      })
  },
  methods: {
    ...mapActions('boards', { findBoards: 'find' }),
  },
  computed: {
    ...mapState('auth', { user: 'payload' }),
    ...mapState('boards', {
      loading: 'isFindPending',
      creating: 'isCreatePending',
      }),
    ...mapGetters('boards', { findBoardsMotoInStore: 'find'}),
    ...mapGetters('boards', { findBoardsInStore: 'find'}),
    boards () {
      return this.findBoardsInStore({
        query:{
          ownerId: this.user.user._id,
        } }).data;
    },
    boardsMoto () {
      return this.findBoardsMotoInStore({
        query:{
          name: "Moto",
          ownerId: this.user.user._id,
        } }).data;
    }
  }
};
</script>