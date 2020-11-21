<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button></ion-menu-button>
        </ion-buttons>
        <ion-title @click="explorer">QRL Explorer</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>

      <ion-toolbar color="secondary">
        <ion-buttons slot="start">
          <ion-button @click="goBack()">
            <ion-icon slot="icon-only" :icon="chevronBackOutline"></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-buttons slot="end">
          <ion-button @click="goForward()">
            <ion-icon slot="icon-only" :icon="chevronForwardOutline"></ion-icon>
          </ion-button>
        </ion-buttons>

        <ion-title class="ion-text-center no-hover">Block {{id}}</ion-title>
      </ion-toolbar>

      <ion-grid>
        <ion-row>
          <ion-col>
            <div class="ion-text-center">
                <div v-if="error !== null">Error: {{error.message}}</div>
                <div v-if="info !== null">
                  {{info.data}}
                </div>
                <div v-if="info === null && error === null">
                  <ion-spinner class="ion-text-center" color="secondary"></ion-spinner>
                </div>
            </div>
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-content>
</ion-page>
</template>

<script lang="js">
import { IonGrid, IonCol, IonRow, IonIcon, IonButtons, IonButton, IonSpinner, IonLabel, IonItem, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/vue';
import { useRouter, useRoute } from 'vue-router';
import { chevronForwardOutline, chevronBackOutline } from 'ionicons/icons';
import axios from 'axios';
import API from '../API';
import state from '../store';
// import { ref, computed, watch } from 'vue';

export default {
  name: 'Block',
  components: {
    IonGrid,
    IonCol,
    IonRow,
    IonButtons,
    IonButton,
    IonContent,
    IonHeader,
    IonMenuButton,
    IonPage,
    IonTitle,
    IonToolbar,
    IonSpinner,
    // IonLabel,
    IonIcon,
  },
  data() {
    const route = useRoute()
    return {
      sharedState: state,
      id: route.params.id,
      info: null,
      error: null
    }
  },
  setup() {
    const router = useRouter()
    return { router, chevronBackOutline, chevronForwardOutline };
  },
  beforeMount() {
    this.apiCall()
  },
  methods: {
    explorer() {
      this.router.push('/explorer')
    },
    apiCall() {
      const network = this.sharedState.network
      console.log('Fetching from: ' + network)
      if (network === 'offline') {
        this.error = { message: 'Offline' }
        return
      }
      axios
        .post(`${API}/grpc/${network}/GetObject`, { query: this.id },
      )
      .then(response => (this.info = response))
      .catch(error => (this.error = error))
    },
    goBack() {
      const b = parseInt(this.id)
      if (b > 1) {
        const blockNew = (b - 1).toString()
        this.router.push(`/block/${blockNew}`)
        this.id = blockNew
        this.apiCall()
      }
    },
    goForward() {
      const b = parseInt(this.id)
      const blockNew = (b + 1).toString()
      this.router.push(`/block/${blockNew}`)
      this.id = blockNew
      this.apiCall()
    }
  },
  watch: {
    'sharedState.network': async function (oldState, newState) {
      console.log(`Network changed ${oldState} -> ${newState} -- refresh explorer view`);
      this.info = null
      this.error = null
      this.apiCall()
    }
  },
}
</script>

<style scoped>
ion-menu-button {
  color: var(--ion-color-primary);
}
ion-content{
  --background: none;
  background-image: url('../img/dots.png');
  background-color: #0b181e;
  background-repeat: no-repeat;
  background-position: bottom -250px right -400px;
  background-position-x: right -450px;
  background-position-y: bottom 150px;
}
ion-title {
  transition: opacity .3s ease-in-out,color .3s ease-in-out;
}
ion-title:hover {
  color: var(--ion-color-primary);
  cursor: pointer;
}
.no-hover:hover {
  color: unset;
  cursor: unset;
}

</style>