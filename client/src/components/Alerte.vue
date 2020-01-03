<template>
  <v-alert dismissible :value="true" :type="type">{{ message }}</v-alert>
</template>

<script>

export default {
  name: 'bar-alerte',
  props: {
    message: String,
    type : String,
  },
  data: () => ({
    //
  }),
};
</script>