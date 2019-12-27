<template>
  <v-container fluid fill-height>
    <v-row>
      <v-col cols="12">
        <v-card
          class="transparent"
          v-if="!createMode"
          @click.stop="$emit('activateCreateMode')"
          @mouseenter="cardHover = true"
          @mouseleave="cardHover = false"
          color="primary white--text"
        >
          <span class="headline">Add a list...</span>
        </v-card>
        <v-card v-else @click.stop="$emit('activateCreateMode')">
          <v-form
            ref="form"
            v-model="validList"
            @submit.prevent="createList"
            @keydown.prevent.enter
          >
            <v-card-title>
              <v-container pa-0>
                <v-layout column>
                  <v-flex>
                    <v-text-field
                      ref="listname"
                      v-model="list.name"
                      :rules="notEmptyRules"
                      label="Name"
                      required
                      autofocus
                    ></v-text-field>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="primary" type="submit" :disabled="!validList">Create</v-btn>
            </v-card-actions>
          </v-form>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { notEmptyRules } from '@/validators';
import { mapActions, mapState, mapGetters } from 'vuex';

export default {
  name:'create-list',
  props: ['createMode','createActivity'],
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