<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button></ion-menu-button>
        </ion-buttons>
        <ion-title>QRL Zeus</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <img src="../img/ZEUS.svg">
      <div class="ion-text-center">
        <img src="../img/zeus-logo.svg">
      </div>
      <div class="ion-text-center pb-5">
        <ion-button>Unlock</ion-button>
      </div>
      <div class="ion-text-right ion-padding ion-margin">
        <img src="../img/qrl-logo.svg">
      </div>
    </ion-content>
</ion-page>
</template>

<script lang="js">
import { IonButtons, IonRow, IonItem, IonRadioGroup, IonListHeader, IonButton, IonRadio, IonLabel, IonToggle, IonCol, IonGrid, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/vue';
// import { useRoute } from 'vue-router';
// import { ref, computed, watch } from 'vue';

export default {
  name: 'New',
  components: {
    IonButtons,
    // IonButton,
    // IonRadio,
    IonContent,
    IonHeader,
    IonMenuButton,
    // IonGrid,
    // IonCol,
    // IonRow,
    // IonItem,
    // IonRadioGroup,
    // IonListHeader,
    // IonLabel,
    // IonToggle,
    IonPage,
    IonTitle,
    IonToolbar,
  },
  data() {
    return {
    }
  },
  methods: {
  }
}
</script>

<style scoped>
ion-menu-button {
  color: var(--ion-color-primary);
}
ion-content{
    --background: #0b181e url('../img/dots.png') no-repeat bottom -250px right -400px;
}
.pb-5 {
  padding-bottom: 30px;
}
</style>
