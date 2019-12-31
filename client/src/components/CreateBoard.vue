<template>
  <v-card
    class="transparent"
    v-if="!createMode"
    @click.stop="$emit('activateCreateMode')"
    color="primary white--text"
  >
    <span class="headline">Add a card...</span>
  </v-card>
  <v-card
    min-height="200px"
    max-height="200px"
    v-else
    @click.stop="$emit('activateCreateMode')"
  >
    <v-form
      v-if="!creating"
      v-model="valid"
      @submit.prevent="createBoard"
      @keydown.prevent.enter
    >
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

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn type="submit" :disabled="!valid" color="primary" text>Save</v-btn>
        </v-card-actions>
      </v-container>
    </v-form>
  </v-card>
</template>
<script>
import { notEmptyRules } from '@/validators';
import { mapActions, mapState } from 'vuex'
export default {
    name:'create-board',
    props:['createMode'],
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

