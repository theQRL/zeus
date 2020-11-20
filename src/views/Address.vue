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
      <ion-grid>
        <ion-row>
          <ion-col>
            <div class="ion-text-center">
              Address:<br>
                {{id}}<br>
                <div v-if="error !== null">Error: {{error.message}}</div>
                <div v-if="info !== null">
                  Balance: {{info.data.state.balance}} Shor
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
import { IonGrid, IonCol, IonRow, IonButtons, IonButton, IonSpinner, IonLabel, IonItem, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/vue';
import { useRouter, useRoute } from 'vue-router';
import axios from 'axios';
import API from '../API'
// import { ref, computed, watch } from 'vue';

export default {
  name: 'Address',
  components: {
    IonGrid,
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
    // IonLabel,
    // IonItem
  },
  data() {
    const route = useRoute()
    return {
      id: route.params.id,
      info: null,
      error: null
    }
  },
  beforeMount() {
    axios
      .post(`${API}/grpc/testnet/GetOptimizedAddressState`, { address: this.id },
      )
      .then(response => (this.info = response))
      .catch(error => (this.error = error))
  },
  setup() {
    const router = useRouter()
    return { router };
  },
  methods: {
    explorer() {
      this.router.push('/explorer')
    }
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
ion-title {
  transition: opacity .3s ease-in-out,color .3s ease-in-out;
}
ion-title:hover {
  color: var(--ion-color-primary);
  cursor: pointer;
}
</style>
