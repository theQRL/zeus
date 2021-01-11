<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button></ion-menu-button>
        </ion-buttons>
        <ion-title>New Wallet</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <div id="container">
        <ion-grid v-if="result">
           <p>{{ result }}</p>
        </ion-grid>
        <ion-grid v-if="generating">
           <ion-spinner name="crescent"></ion-spinner>
        </ion-grid>
        <ion-grid v-if="!generating && !result">
          <ion-row>
            <ion-col></ion-col>
            <ion-col>
              <ion-item>
                <ion-label>Advanced options</ion-label>
                <ion-toggle name="advanced" v-on:click="toggle"></ion-toggle>
              </ion-item>
            </ion-col>
            <ion-col></ion-col>
          </ion-row>
          <ion-row v-if="shown">
            <ion-col></ion-col>
            <ion-col>
              <ion-radio-group value="SHA2_256">
                <ion-list-header>
                  <ion-label class="ion-text-left">Hash Function</ion-label>
                </ion-list-header>

                <ion-item>
                  <ion-label>SHA2_256</ion-label>
                  <ion-radio value="SHA2_256"></ion-radio>
                </ion-item>

                <ion-item>
                  <ion-label>SHAKE_128</ion-label>
                  <ion-radio value="SHAKE_128"></ion-radio>
                </ion-item>

                <ion-item>
                  <ion-label>SHAKE_256</ion-label>
                  <ion-radio value="SHAKE_256"></ion-radio>
                </ion-item>
              </ion-radio-group>

              <ion-radio-group value="10">
                <ion-list-header>
                  <ion-label class="ion-text-left">Tree Height</ion-label>
                </ion-list-header>

                <ion-item>
                  <ion-label>8 (Signatures: 256)</ion-label>
                  <ion-radio value="8"></ion-radio>
                </ion-item>

                <ion-item>
                  <ion-label>10 (Signatures: 1,024)</ion-label>
                  <ion-radio value="10"></ion-radio>
                </ion-item>

                <ion-item>
                  <ion-label>12 (Signatures: 4,096)</ion-label>
                  <ion-radio value="12"></ion-radio>
                </ion-item>

                <ion-item>
                  <ion-label>14 (Signatures: 16,384)</ion-label>
                  <ion-radio value="14"></ion-radio>
                </ion-item>

                <ion-item>
                  <ion-label>16 (Signatures: 65,536)</ion-label>
                  <ion-radio value="16"></ion-radio>
                </ion-item>
              </ion-radio-group>
            </ion-col>
            <ion-col></ion-col>
          </ion-row>
          <ion-row>
            <ion-col></ion-col>
            <ion-col>
              <ion-button expand="block" v-on:click="generateWallet">Create Wallet</ion-button>
            </ion-col>
            <ion-col></ion-col>
          </ion-row>
        </ion-grid>
      </div>
    </ion-content>
  </ion-page>
</template>

<script lang="js">
/* global QRLLIB */
import { IonButtons, IonSpinner, IonRow, IonItem, IonRadioGroup, IonListHeader, IonButton, IonRadio, IonLabel, IonToggle, IonCol, IonGrid, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/vue';
import randomBytes from 'random-bytes'
export default {
  name: 'New',
  components: {
    IonButtons,
    IonButton,
    IonRadio,
    IonContent,
    IonHeader,
    IonMenuButton,
    IonGrid,
    IonCol,
    IonRow,
    IonItem,
    IonRadioGroup,
    IonListHeader,
    IonLabel,
    IonToggle,
    IonPage,
    IonTitle,
    IonToolbar,
    IonSpinner
  },
  data() {
    return {
      shown: false,
      generating: false,
      result: null,
    }
  },
  methods: {
    toggle() {
      this.shown = !this.shown
    },
    generateWallet() {
      this.generating = true
      const toUint8Vector = (arr) => {
        const vec = new QRLLIB.Uint8Vector();
        for (let i = 0; i < arr.length; i += 1) {
          vec.push_back(arr[i]);
        }
        return vec;
      };
      async function makeWallet() {
        let XMSS_OBJECT = null;
        const hashFunction = QRLLIB.eHashFunction.SHA2_256
        const xmssHeight = 8
        const randomSeed = toUint8Vector(await randomBytes(48));
        XMSS_OBJECT = await new QRLLIB.Xmss.fromParameters(randomSeed, xmssHeight, hashFunction);
        return XMSS_OBJECT;
      }

      async function gen() {
        const Q = await makeWallet();
        console.log(Q.getAddress());
        return Q
      }
      // generate an address asynchronously
      this.$nextTick(() => {
        gen().then((Q) => {
          this.generating = false
          this.result = {
            address: Q.getAddress(),
            hexseed: Q.getHexSeed(),
            mnemonic: Q.getMnemonic(),
          }
        })
      })
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
</style>
