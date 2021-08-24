<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button></ion-menu-button>
        </ion-buttons>
        <ion-title>Wallet...</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <div id="container">
        Details<br>
        {{ wallet }}
      </div>
    </ion-content>
  </ion-page>
</template>

<script lang="js">
/* global QRLLIB */
import {
  // IonSegment, IonSegmentButton, IonItem,
  // IonRow, IonCol, IonLabel, IonInput,
  IonButtons,
  // IonButton, IonGrid,
  IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/vue';
import { useRoute } from 'vue-router';
export default {
  name: 'New',
  components: {
    IonButtons,
    // IonButton,
    IonContent,
    IonHeader,
    // IonSegment,
    // IonSegmentButton,
    IonMenuButton,
    // IonGrid,
    IonPage,
    // IonItem,
    // IonRow,
    // IonCol,
    // IonLabel,
    // IonInput,
    IonTitle,
    IonToolbar,
  },
  methods: {
  },
  data() {
    const route = useRoute();
    let wallet = null;
    wallet = route.params.id;
    return { wallet }
  }
}
</script>

<style scoped>
ion-menu-button {
  color: var(--ion-color-primary);
}
ion-content {
  --background: #0b181e url("../img/dots.png") no-repeat bottom -250px right -400px;
}
ion-segment-button.md {
  color: var(--ion-color-step-650);
}
ion-segment-button.md.segment-button-checked:hover {
  --background-hover-opacity: 0;
  cursor: unset;
}
ion-segment-button.md:hover:not(.segment-button-checked) {
  background: rgba(var(--ion-color-primary-rgb), 0.14);
  --background-hover-opacity: 0.14;
  cursor: pointer;
}
ion-segment-button.md:hover:not(.segment-button-checked)::part(native) {
  color: #fff;
}
</style>
