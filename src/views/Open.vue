<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button></ion-menu-button>
        </ion-buttons>
        <ion-title>Open Wallet</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <div id="container">
        <ion-grid v-if="type === null">
          <ion-toolbar>
            <ion-segment v-model="activeSegment" value="hexseed" color="secondary">
              <ion-segment-button value="hexseed">Hexseed/Mnemonic</ion-segment-button>
              <ion-segment-button value="file">File</ion-segment-button>
              <ion-segment-button value="ledger">Ledger Nano</ion-segment-button>
            </ion-segment>
          </ion-toolbar>
        </ion-grid>
        <ion-grid v-if="activeSegment === 'hexseed'">
          <ion-item>
            <ion-label position="stacked">Hexseed / Mnemonic</ion-label>
            <ion-input placeholder="hexseed or mnemonic" type="password" v-model="hexOrMnemonic"></ion-input>
          </ion-item>
        <ion-item color="danger" v-if="error !== null">
          <ion-label>{{error}}</ion-label>
        </ion-item>
          <ion-row>
            <ion-col></ion-col>
            <ion-col>
              <ion-button expand="block" v-on:click="openWallet">Open Wallet</ion-button>
            </ion-col>
            <ion-col></ion-col>
          </ion-row>
        </ion-grid>
        <ion-grid v-if="activeSegment === 'file'">
          <p>FILE UI</p>
        </ion-grid>
        <ion-grid v-if="activeSegment === 'ledger'">
          <p>LEDGER UI</p>
        </ion-grid>
      </div>
    </ion-content>
  </ion-page>
</template>

<script lang="js">
/* global QRLLIB */
import { IonSegment, IonSegmentButton, IonItem, IonRow, IonCol, IonLabel, IonInput, IonButtons, IonButton, IonGrid, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/vue';
import { useRoute } from 'vue-router';
export default {
  name: 'New',
  components: {
    IonButtons,
    IonButton,
    IonContent,
    IonHeader,
    IonSegment,
    IonSegmentButton,
    IonMenuButton,
    IonGrid,
    IonPage,
    IonItem,
    IonRow,
    IonCol,
    IonLabel,
    IonInput,
    IonTitle,
    IonToolbar,
  },
  data() {
    const route = useRoute()
    let type = null
    let activeSegment = 'hexseed'
    if (route.params.type) {
      type = route.params.type.toLowerCase()
      activeSegment = type
    }
    console.log(type)
    return {
      activeSegment,
      type,
      shown: false,
      generating: false,
      result: null,
      hexOrMnemonic: null,
      error: null,
    }
  },
  methods: {
    openWallet() {
      console.log('Open wallet clicked')
      console.log(this.hexOrMnemonic)
      let type = null
      if (this.hexOrMnemonic.trim().length === 102) {
        type = 'hexseed'
      }
      if (this.hexOrMnemonic.trim().split(' ') === 34) {
        type = 'mnemonic'
      }
      let XMSS_OBJECT = null;
      let thisAddress = null;
      if (type === null) {
        this.error = 'Invalid hexseed/mnemonic: please check carefully'
        return
      }
      if (type === 'hexseed') {
        XMSS_OBJECT = QRLLIB.Xmss.fromHexSeed(this.hexOrMnemonic);
      }
      if (type === 'mnemonic') {
        XMSS_OBJECT = QRLLIB.Xmss.fromMnemonic(this.hexOrMnemonic);
      }
      if (type !== null) {
        thisAddress = XMSS_OBJECT.getAddress();
        console.log(thisAddress)
      }
    }
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
