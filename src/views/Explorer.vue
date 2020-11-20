<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button></ion-menu-button>
        </ion-buttons>
        <ion-title>QRL Explorer</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-grid>
        <ion-row>
          <ion-col>
            <div class="ion-text-center">
              <ion-item>
                <ion-label position="stacked">Search</ion-label>
                <ion-input v-model="query" @keydown.enter="search" autofocus="true" placeholder="address, txhash, block" enterkeyhint="search"></ion-input>
              </ion-item>
              <ion-button v-on:click="search" class="mt-2">Search</ion-button>
            </div>
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-content>
</ion-page>
</template>

<script lang="js">
import { IonGrid, IonCol, IonRow, IonButtons, IonButton, IonInput, IonLabel, IonItem, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/vue';
import { useRouter } from 'vue-router';
// import { ref, computed, watch } from 'vue';

const identifySearch = (str) => {
  let adjusted = str.trim()
  if (adjusted.charAt(0) === 'q') {
    adjusted = `Q${adjusted.substr(1, adjusted.length - 1)}`
  }
  const type = { parameter: adjusted, type: 'Undetermined' }
  if (adjusted.length === 79 && adjusted.charAt(0) === 'Q') {
    type.type = 'Address'
    type.route = `/a/${adjusted}`
  }
  if ((adjusted.length === 64) && (parseInt(adjusted, 10) !== adjusted)) {
    type.type = 'Txhash'
    type.route = `/tx/${adjusted}`
  }
  if ((parseInt(adjusted, 10).toString()) === adjusted) {
    type.type = 'Block'
    type.route = `/block/${adjusted}`
  }
  return type
}

export default {
  name: 'Explorer',
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
    IonInput,
    IonLabel,
    IonItem
  },
  data() {
    return {
      query: false
    }
  },
  setup() {
    const router = useRouter();
    return { router };
  },
  beforeMount() {
    this.query = ''
  },
  methods: {
    search() {
      this.router.push(identifySearch(this.query).route)
      this.query = ''
      return false
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
.mt-2 {
  margin-top: 20px !important;
}
</style>
