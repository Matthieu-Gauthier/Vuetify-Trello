<template>
  <div class="text-center">
    <v-menu v-model="menu" :close-on-content-click="false" :nudge-width="200" offset-y bottom>
      <template v-slot:activator="{ on }">
        <v-btn color="primary" dark v-on="on">
          Add new list
        </v-btn>
      </template>
        <v-form 
        v-if="!creatingList && !boardsError"
        v-model="validList"
        @submit.prevent="createList"
        @keydown.prevent.enter>
            <v-card :color="list.color" mx-auto>
               <v-container>
                 <v-text-field v-model= "list.name" :rules="notEmptyRules" label="Name" required></v-text-field>
                </v-container>
                <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" text @click="menu = false">Cancel</v-btn>
                <v-btn type="submit" :disabled="!validList" color="primary" text @click="menu = false">Save</v-btn>
                </v-card-actions>
            </v-card>
        </v-form>
    </v-menu>
  </div>
</template>

<script>
import { notEmptyRules } from '@/validators';
import { mapActions, mapState, mapGetters } from 'vuex';

export default {
  name:'create-list',
  props: ['createActivity'],
  data: vm => ({
    menu: false,
    validList: false,
    list: {
      name: '',
      order: 0,
      archived: false,
      color:'#FF000000',
    },
    notEmptyRules,
  }),
  methods: {
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
  },
};
</script>