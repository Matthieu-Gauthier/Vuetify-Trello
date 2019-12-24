<template>
    <v-row >
        <v-col justify=center align=center>
            <v-progress-circular
            :size="70"
            :width="7"
            indeterminate
            color="primary">
            </v-progress-circular>
        </v-col>
    </v-row>
</template>

<script>

export default {
  name:'loading-bar',
}
</script>
