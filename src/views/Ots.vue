<template>
  <ion-list>
    <ion-text color="light">USED</ion-text> {{ used }} / {{ total }} <ion-text color="light">REMAINING</ion-text>
    <ion-progress-bar color="secondary" :value="(used/total)"></ion-progress-bar>
  </ion-list>
</template>

<script lang="js">
import { IonProgressBar, IonText, IonList } from '@ionic/vue'

// import { ref, computed, watch } from 'vue';

export default {
  name: 'Tokens',
  components: {
    IonProgressBar, IonText, IonList
  },
  props: ['used', 'total'],
}
</script>
<style scoped>
ion-list {
  margin-top: 40px;
  margin-bottom: 40px;
}
ion-progress-bar {
  margin-top: 10px;
}
</style>