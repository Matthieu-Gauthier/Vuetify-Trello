<template>
  <div class="text-center">
    <v-menu
      v-model="menu"
      :close-on-content-click="false"
      :nudge-width="200"
      offset-y
      bottom
    >
      <template v-slot:activator="{ on }">
        <v-btn color="primary" dark v-on="on">Add new board</v-btn>
      </template>
      <v-form
        v-if="!creating"
        v-model="valid"
        @submit.prevent="createBoard"
        @keydown.prevent.enter
      >
        <v-card>
          <v-container>
            <v-text-field
              v-model="board.name"
              :rules="notEmptyRules"
              label="Name"
              required
            ></v-text-field>
            <v-text-field
              v-model="board.background"
              :rules="notEmptyRules"
              label="Background"
              required
            ></v-text-field>
          </v-container>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" text @click="menu = false">Cancel</v-btn>
            <v-btn
              type="submit"
              :disabled="!valid"
              color="primary"
              text
              @click="menu = false"
            >Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-menu>
  </div>
</template>

<script>
import { notEmptyRules } from '@/validators';
import { mapActions, mapState, mapGetters } from 'vuex'
export default {
    name:'create-board',
    data: vm => ({
        menu: false,
        valid: false,
        board: {
            name: '',
            background: '',
            memberIds: [],
        },
        notEmptyRules,
    }),
    methods: {
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
        creating: 'isCreatePending',
        }),
    }
};
</script>

