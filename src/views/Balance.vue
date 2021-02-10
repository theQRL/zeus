<template>
  <ion-text color="secondary">
    <ion-label>BALANCE</ion-label>
  </ion-text>
  <ion-text>
    <h1 id="balance">
      {{ balance }}
    </h1>
  </ion-text>
  Quanta
</template>

<script lang="js">
import { IonText, IonLabel } from '@ionic/vue'

// import { ref, computed, watch } from 'vue';

export default {
  name: 'Balance',
  components: {
    IonText, IonLabel
  },
  props: ['balance'],
}
</script>
<style scoped>
#balance {
  margin-top: 10px;
}
</style>