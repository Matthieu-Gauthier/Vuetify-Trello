<template>
  <v-row justify="start">
    <v-col v-for="n in 20" cols="12" xl="2" lg="2" md="6" sm="12" xs="12">
      <v-skeleton-loader min-height="200px" type="card, list-item"></v-skeleton-loader>
    </v-col>
    <!-- <v-progress-circular :size="70" :width="7" indeterminate color="primary"></v-progress-circular> -->
  </v-row>
</template>

<script>
export default {
  name: "loading-bar"
};
</script>

