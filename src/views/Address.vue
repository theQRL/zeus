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
    <ion-toolbar color="primary">
      <ion-title class="ion-text-center no-hover">{{id}} <ion-icon id="verified" v-if="!(this.error)" :icon="checkmarkCircleOutline"></ion-icon></ion-title>
    </ion-toolbar>
      <ion-grid>
        <ion-row>
          <ion-col>
          <ion-toolbar>
            <ion-segment value="info" color="secondary">
              <ion-segment-button value="info">Info</ion-segment-button>
              <ion-segment-button value="ots">OTS</ion-segment-button>
              <ion-segment-button value="tokens">Tokens</ion-segment-button>
              <ion-segment-button value="multisig">Multisig</ion-segment-button>
            </ion-segment>
          </ion-toolbar>
            <div class="ion-text-center">
              Address:<br>
                {{id}}<br>
                <div v-if="error !== null">Error: {{error.message}}</div>
                <div v-if="info !== null">
                  {{info}}
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
import { IonGrid, IonIcon, IonCol, IonRow, IonSegment, IonSegmentButton, IonButtons, IonButton, IonSpinner, IonLabel, IonItem, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/vue';
import { useRouter, useRoute } from 'vue-router';
import { checkmarkCircleOutline } from 'ionicons/icons';
import axios from 'axios';
import helpers from '@theqrl/explorer-helpers'
import API from '../API'
import state from '../store';

// import { ref, computed, watch } from 'vue';

export default {
  name: 'Address',
  components: {
    IonGrid,
    IonIcon,
    IonCol,
    IonRow,
    IonButtons,
    // IonButton,
    IonContent,
    IonHeader,
    IonMenuButton,
    IonPage,
    IonTitle,
    IonToolbar,
    IonSpinner,
    IonSegment,
    IonSegmentButton,
    // IonLabel,
    // IonItem
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
  beforeMount() {
    this.apiCall()
  },
  setup() {
    const router = useRouter()
    return { router, checkmarkCircleOutline };
  },
  methods: {
    explorer() {
      this.router.push('/explorer')
    },
    apiCall() {
      const network = this.sharedState.network
      if (network === 'offline') {
        this.error = { message: 'Offline' }
        return
      }
      console.log('Fetching from: ' + network)
      axios
        .post(`${API}/grpc/${network}/GetOptimizedAddressState`, { address: this.id },
        )
        .then(response => {
          if (response.data.code === 3) {
            this.error = { message: response.data.details }
          } else {
            console.log(helpers.a(response.data))
            this.info = helpers.a(response.data)
          }
        })
        .catch(error => (this.error = error))
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
ion-segment-button.md {
  color: var(--ion-color-step-650);
}
ion-segment-button.md :hover {
  background: rgba(var(--ion-color-primary-rgb), 0.14);
  color: #fff !important;
  cursor: pointer;
}
.addr {
  transition: opacity .3s ease-in-out,color .3s ease-in-out;
  cursor: pointer;
}
.addr:hover {
  color: var(--ion-color-primary);
}
.no-hover:hover {
  color: unset;
  cursor: unset;
}
#verified {
  margin-top: 2px;
  position: absolute;
  margin-left: 4px;
}
</style>
