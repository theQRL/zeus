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

        <ion-title class="ion-text-center no-hover">Block {{id}} <ion-icon id="verified" v-if="!(this.error)" :icon="checkmarkCircleOutline"></ion-icon></ion-title>
      </ion-toolbar>

      <ion-grid>
        <ion-row>
          <ion-col>
            <div class="ion-text-center">
                <div v-if="error !== null">Error: {{error.message}}</div>
                <div v-if="info !== null">
                  <!-- Block display START -->
                  <!-- {{info}} -->
                  <p>{{dt(info.block_extended.header.timestamp_seconds)}}</p>
                  <ion-list>
                    <ion-list-header color="secondary">
                      TRANSACTIONS
                    </ion-list-header>
                    <ion-item-group>

                      <ion-item-divider v-if="this.coinbase.length > 0">
                        <ion-label>COINBASE</ion-label>
                      </ion-item-divider>
                      <ion-item lines="none" v-for="t in coinbase" :key="t.timestamp_seconds">
                        <ion-icon @click="this.router.push(`/tx/${t.tx.transaction_hash}`)" slot="start" class="addr" :icon="ellipsisHorizontalOutline"></ion-icon>
                        <ion-label class="addr" @click="this.router.push(`/a/${t.tx.coinbase.addr_to}`)">{{t.tx.coinbase.addr_to}}</ion-label>
                        <ion-note slot="end" color="secondary">{{(t.tx.coinbase.amount / 10e8 )}} Quanta </ion-note>
                      </ion-item>

                      <ion-item-divider v-if="this.tx.length > 0">
                        <ion-label>TRANSFERS</ion-label>
                      </ion-item-divider>
                      <ion-item lines="none" v-for="t in tx" :key="t.timestamp_seconds">
                        <ion-label class="addr" @click="this.router.push(`/tx/${t.tx.transaction_hash}`)">{{t.tx.transaction_hash}}</ion-label>
                        <ion-note slot="end" color="secondary">{{(t.tx.transfer.total / 10e8 )}} Quanta</ion-note>
                      </ion-item>

                      <ion-item-divider v-if="this.keybase.length > 0">
                        <ion-label>KEYBASE</ion-label>
                      </ion-item-divider>
                      <ion-item lines="none" v-for="t in keybase" :key="t.timestamp_seconds">
                        <ion-label class="addr" @click="this.router.push(`/a/${t.addr_from}`)">{{t.addr_from}}</ion-label>
                        <ion-note slot="end" color="secondary">{{(t.explorer.message.keybaseType )}} {{(t.explorer.message.keybaseUser )}}</ion-note>
                      </ion-item>

                      <ion-item-divider v-if="this.msCreate.length > 0">
                        <ion-label>MULTISIG_CREATE</ion-label>
                      </ion-item-divider>
                      <ion-item lines="none" v-for="t in msCreate" :key="t.timestamp_seconds">
                        <ion-label class="addr" @click="this.router.push(`/tx/${t.tx.transaction_hash}`)">{{t.tx.transaction_hash}}</ion-label>
                        <ion-note slot="end" color="secondary">{{(t.tx.multi_sig_create.signatories.length )}} signatories</ion-note>
                      </ion-item>

                    </ion-item-group>
                  </ion-list>


                  <!--
                  <div v-for="t in info.block_extended.extended_transactions" :key="t.tx.transactionType">
                    {{t.tx.transactionType}}<br>
                    {{t.addr_from}}<br>
                    {{dt(t.timestamp_seconds)}}
                  </div>
                  -->

                  <!-- Block display END  -->
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
import { IonGrid, IonList, IonItemGroup, IonListHeader, IonItemDivider, IonNote, IonCol, IonRow, IonIcon, IonButtons, IonButton, IonSpinner, IonLabel, IonItem, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/vue';
import { useRouter, useRoute } from 'vue-router';
import { chevronForwardOutline, chevronBackOutline, checkmarkCircleOutline, ellipsisHorizontalOutline } from 'ionicons/icons';
import axios from 'axios';
import { DateTime } from 'luxon';
import helpers from '@theqrl/explorer-helpers'
import API from '../API';
import state from '../store';
// import { ref, computed, watch } from 'vue';

export default {
  name: 'Block',
  components: {
    IonGrid,
    IonList,
    IonListHeader,
    IonItem,
    IonItemDivider,
    IonItemGroup,
    IonNote,
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
    IonLabel,
    IonIcon,
  },
  data() {
    const route = useRoute()
    return {
      sharedState: state,
      id: route.params.id,
      info: null,
      error: null,
      tx: null,
      coinbase: null,
      message: null,
      keybase: null,
      msCreate: null
    }
  },
  setup() {
    const router = useRouter()
    return { router, chevronBackOutline, chevronForwardOutline, checkmarkCircleOutline, ellipsisHorizontalOutline };
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
      .then(response => {
        if (!response.data.found) {
          console.log(response.data)
          this.error = { message: 'Block not found' }
        } else {
          const formatted = helpers.block(response.data)
          console.log(formatted)
          this.info = formatted
          const tx = []
          const coinbase = []
          const message = []
          const keybase = []
          const msCreate = []
          formatted.block_extended.extended_transactions.forEach(element => {
            if (element.tx.transactionType === 'coinbase') {
              coinbase.push(element)
            }
            if (element.tx.transactionType === 'multi_sig_create') {
              msCreate.push(element)
            }
            if (element.tx.transactionType === 'transfer') {
              let total = 0
              element.tx.transfer.amounts.forEach(amount => {
                total += parseInt(amount)
              })
              element.tx.transfer.total = total
              tx.push(element)
            }
            if (element.tx.transactionType === 'message') {
              if (element.explorer.message.type === 'KEYBASE') {
                keybase.push(element)
              }
              if (element.explorer.message.type === 'MESSAGE') {
                message.push(element)
              }
            }
          })
          this.tx = tx
          this.coinbase = coinbase
          this.message = message
          this.keybase = keybase
          this.msCreate = msCreate
        }
      })
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
    },
    dt(s) {
      const dt = DateTime.fromSeconds(parseInt(s))
      return dt.toLocaleString(DateTime.DATETIME_FULL)
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
.addr {
  color: #fff;
  transition: opacity .3s ease-in-out,color .3s ease-in-out;
  cursor: pointer;
}
.addr:hover {
  color: var(--ion-color-primary);
}
.addr:hover svg {
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