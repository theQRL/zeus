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
        <ion-title class="ion-text-center no-hover">
          {{ id }} <ion-icon id="verified" v-if="!this.error" :icon="checkmarkCircleOutline"></ion-icon>
        </ion-title>
      </ion-toolbar>
            <ion-grid>
        <ion-row>
          <ion-col style="text-align: center;">
          <div v-if="info !== null">
            <Balance :balance="parseInt(info.state.balance) / 10e8"></Balance>
            </div>
          </ion-col>
        </ion-row>
            </ion-grid>
      <ion-grid>
        <ion-row>
          <ion-col>
            <div class="ion-text-center">
              <ion-toolbar>
                <ion-segment v-model="activeSegment" value="info" color="secondary">
                  <ion-segment-button value="info">Info</ion-segment-button>
                  <ion-segment-button value="ots">OTS</ion-segment-button>
                  <ion-segment-button value="tokens">Tokens</ion-segment-button>
                  <ion-segment-button value="multisig">Multisig</ion-segment-button>
                </ion-segment>
              </ion-toolbar>
              <div class="mid-container">
                <div v-if="error !== null">Error: {{ error.message }}</div>
              </div>
              
              <div v-if="activeSegment === 'info'">
                <div class="mid-container" v-if="info === null && error === null">
                  <ion-spinner class="ion-text-center" color="secondary"></ion-spinner>
                </div>
                <div class="mid-container" v-if="info !== null">
                  <ion-item-group>
                    <ion-item-divider>
                      <ion-label> TRANSACTIONS </ion-label>
                    </ion-item-divider>
                    <ion-item lines="none">
                      <ion-label>
                        {{ info.state.transaction_hash_count }}
                      </ion-label>
                    </ion-item>
                  </ion-item-group>
                  <ion-item-group>
                    <ion-item-divider>
                      <ion-label> SIGNATURE TYPE </ion-label>
                    </ion-item-divider>
                    <ion-item lines="none">
                      <ion-label>
                        {{ validate().sig.type }}
                      </ion-label>
                    </ion-item>
                  </ion-item-group>
                  <ion-item-group>
                    <ion-item-divider>
                      <ion-label> HASH FUNCTION </ion-label>
                    </ion-item-divider>
                    <ion-item lines="none">
                      <ion-label>
                        {{ validate().hash.function }}
                      </ion-label>
                    </ion-item>
                  </ion-item-group>
                </div>
              </div>
              <div v-if="activeSegment === 'ots'">
                <div v-if="info === null && error === null">
                  <ion-spinner class="ion-text-center" color="secondary"></ion-spinner>
                </div>
                <div v-if="info !== null">
                  <Ots :used="info.state.used_ots_key_count" :total="validate().sig.number"></Ots>
                </div>
              </div>
              <div v-if="activeSegment === 'tokens'">
                <div v-if="info === null && error === null">
                  <ion-spinner class="ion-text-center" color="secondary"></ion-spinner>
                </div>
                <div v-if="info !== null" id="token-list">
                  <Tokens v-bind:id="id"></Tokens>
                </div>
              </div>
              <div v-if="activeSegment === 'multisig'">
                <div v-if="info === null && error === null">
                  <ion-spinner class="ion-text-center" color="secondary"></ion-spinner>
                </div>
                <div v-if="info !== null" id="multisig-list">
                  <Multisig v-bind:id="id"></Multisig>
                </div>
              </div>
            </div>
          </ion-col>
        </ion-row>
      </ion-grid>
      <ion-fab vertical="bottom" horizontal="end" slot="fixed">
        <ion-fab-button>
          <ion-icon :ios="bookmarkOutline" :md="bookmarkSharp"></ion-icon>
        </ion-fab-button>
        <ion-fab-list side="start">
          <Bookmark></Bookmark>
        </ion-fab-list>
      </ion-fab>
    </ion-content>
  </ion-page>
</template>

<script lang="js">
import { IonFab, IonFabList, IonLabel, IonItem, IonItemGroup, IonItemDivider, IonFabButton, IonGrid, IonIcon, IonCol, IonRow, IonSegment, IonSegmentButton, IonButtons, IonSpinner, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/vue'
import { useRouter, useRoute } from 'vue-router'
import { checkmarkCircleOutline, bookmarkOutline, bookmarkSharp } from 'ionicons/icons'
import validateAddress from '@theqrl/validate-qrl-address'
import axios from 'axios'
import helpers from '@theqrl/explorer-helpers'
import API from '../API'
import state from '../store'
import Tokens from './Tokens.vue'
import Multisig from './Multisig.vue'
import Bookmark from './Bookmark.vue'
import Ots from './Ots.vue'
import Balance from './Balance.vue'

// import { ref, computed, watch } from 'vue';

export default {
  name: 'Address',
  components: {
    IonFab,
    IonFabList,
    IonFabButton,
    IonGrid,
    IonIcon,
    IonCol,
    IonRow,
    IonButtons,
    IonLabel,
    IonItem,
    IonItemDivider,
    IonItemGroup,
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
    // IonItem,
    Tokens,
    Multisig,
    Bookmark,
    Ots,
    Balance
  },
  data() {
    const route = useRoute()
    return {
      sharedState: state,
      activeSegment: 'info',
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
    return { router, checkmarkCircleOutline, bookmarkOutline, bookmarkSharp };
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
    },
    segmentDisplay(seg) {
      if (this.activeSegment === seg) {
        return true
      }
      return false
    },
    validate() {
      return validateAddress.hexString(this.info.state.address)
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
ion-content {
  --background: none;
  background-image: url("../img/dots.png");
  background-color: #0b181e;
  background-repeat: no-repeat;
  background-position: bottom -250px right -400px;
  background-position-x: right -450px;
  background-position-y: bottom 150px;
}
ion-title {
  transition: opacity 0.3s ease-in-out, color 0.3s ease-in-out;
}
ion-title:hover {
  color: var(--ion-color-primary);
  cursor: pointer;
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
.addr {
  transition: opacity 0.3s ease-in-out, color 0.3s ease-in-out;
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
.mid-container {
  text-align: center;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  transform: translateY(50%);
}
#token-list {
  margin-top: 15px;
}
#balance {
  margin-top: 10px;
}
</style>
