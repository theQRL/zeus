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
          Transaction {{ id }}
          <ion-icon id="verified" v-if="!this.error && this.confirmed" :icon="checkmarkCircleOutline"></ion-icon>
        </ion-title>
      </ion-toolbar>
      <ion-grid>
        <ion-row>
          <ion-col>
            <div class="ion-text-center">
              <div v-if="error !== null">Error: {{ error.message }}</div>
              <div v-if="info !== null">
                <p>{{ dt(info.transaction.timestamp_seconds) }}</p>

                <!-- TRANSFER start -->
                <ion-list v-if="info.transaction.tx.transactionType === 'transfer'">
                  <ion-list-header color="secondary"> TRANSFER </ion-list-header>
                  <ion-item-divider>
                    <ion-label>FROM</ion-label>
                  </ion-item-divider>
                  <ion-item lines="none">
                    <ion-label class="addr" @click="this.router.push(`/a/${info.transaction.addr_from}`)">{{
                      info.transaction.addr_from
                    }}</ion-label>
                  </ion-item>
                  <ion-item-group>
                    <ion-item-divider>
                      <ion-label>TO</ion-label>
                    </ion-item-divider>
                    <ion-item v-for="output in outputs" v-bind:key="output.addrTo" lines="none">
                      <ion-label class="addr" @click="this.router.push(`/a/${output.addrTo}`)">{{
                        output.addrTo
                      }}</ion-label>
                      <ion-note slot="end" color="secondary">{{ output.amount / 10e8 }} Quanta</ion-note>
                    </ion-item>
                  </ion-item-group>
                  <ion-item-group>
                    <ion-item-divider>
                      <ion-label>TOTAL TRANSFERRED</ion-label>
                    </ion-item-divider>
                    <ion-item lines="none">
                      <ion-label>{{ info.transaction.total / 10e8 }} Quanta</ion-label>
                    </ion-item>
                  </ion-item-group>
                  <ion-item-group>
                    <ion-item-divider>
                      <ion-label>BLOCK</ion-label>
                    </ion-item-divider>
                    <ion-item lines="none">
                      <ion-label
                        class="addr"
                        @click="this.router.push(`/block/${info.transaction.header.block_number}`)"
                        >{{ info.transaction.header.block_number }}</ion-label
                      >
                    </ion-item>
                  </ion-item-group>
                </ion-list>
                <!-- TRANSFER end -->

                <!-- COINBASE start -->
                <ion-list v-if="info.transaction.tx.transactionType === 'coinbase'">
                  <ion-list-header color="secondary"> COINBASE </ion-list-header>
                  <ion-item-divider>
                    <ion-label>TO</ion-label>
                  </ion-item-divider>
                  <ion-item lines="none">
                    <ion-label class="addr" @click="this.router.push(`/a/${info.transaction.tx.coinbase.addr_to}`)">{{
                      info.transaction.tx.coinbase.addr_to
                    }}</ion-label>
                  </ion-item>
                  <ion-item-group>
                    <ion-item-divider>
                      <ion-label>BLOCK REWARD</ion-label>
                    </ion-item-divider>
                    <ion-item lines="none">
                      <ion-label>{{ info.transaction.tx.coinbase.amount / 10e8 }} Quanta</ion-label>
                    </ion-item>
                  </ion-item-group>
                  <ion-item-group>
                    <ion-item-divider>
                      <ion-label>BLOCK</ion-label>
                    </ion-item-divider>
                    <ion-item lines="none">
                      <ion-label
                        class="addr"
                        @click="this.router.push(`/block/${info.transaction.header.block_number}`)"
                        >{{ info.transaction.header.block_number }}</ion-label
                      >
                    </ion-item>
                  </ion-item-group>
                </ion-list>
                <!-- COINBASE end -->

                <!-- MESSAGE start -->
                <ion-list
                  v-if="info.transaction.tx.transactionType === 'message' && info.explorer.message.type === 'MESSAGE'"
                >
                  <ion-list-header color="secondary"> MESSAGE </ion-list-header>
                  <ion-item-divider>
                    <ion-label>FROM</ion-label>
                  </ion-item-divider>
                  <ion-item lines="none">
                    <ion-label class="addr" @click="this.router.push(`/a/${info.transaction.addr_from}`)">{{
                      info.transaction.addr_from
                    }}</ion-label>
                  </ion-item>
                  <ion-item-group>
                    <ion-item-divider>
                      <ion-label>MESSAGE HASH</ion-label>
                    </ion-item-divider>
                    <ion-item lines="none">
                      <ion-label>{{ info.transaction.tx.message.message_hash }}</ion-label>
                    </ion-item>
                  </ion-item-group>
                  <ion-item-group>
                    <ion-item-divider>
                      <ion-label>BLOCK</ion-label>
                    </ion-item-divider>
                    <ion-item lines="none">
                      <ion-label
                        class="addr"
                        @click="this.router.push(`/block/${info.transaction.header.block_number}`)"
                        >{{ info.transaction.header.block_number }}</ion-label
                      >
                    </ion-item>
                  </ion-item-group>
                </ion-list>
                <!-- MESSAGE end -->

                <!-- KEYBASE start -->
                <ion-list
                  v-if="info.transaction.tx.transactionType === 'message' && info.explorer.message.type === 'KEYBASE'"
                >
                  <ion-list-header color="secondary"> KEYBASE </ion-list-header>
                  <ion-item-divider>
                    <ion-label>FROM</ion-label>
                  </ion-item-divider>
                  <ion-item lines="none">
                    <ion-label class="addr" @click="this.router.push(`/a/${info.transaction.addr_from}`)">{{
                      info.transaction.addr_from
                    }}</ion-label>
                  </ion-item>
                  <ion-item-group>
                    <ion-item-divider>
                      <ion-label>KEYBASE ACTION</ion-label>
                    </ion-item-divider>
                    <ion-item lines="none">
                      <ion-label
                        >{{ info.explorer.message.keybaseType }} {{ info.explorer.message.keybaseUser }}</ion-label
                      >
                    </ion-item>
                  </ion-item-group>
                  <ion-item-group>
                    <ion-item-divider>
                      <ion-label>KEYBASE HASH</ion-label>
                    </ion-item-divider>
                    <ion-item lines="none">
                      <ion-label>{{ info.explorer.message.keybaseSignature }}</ion-label>
                    </ion-item>
                  </ion-item-group>
                  <ion-item-group>
                    <ion-item-divider>
                      <ion-label>BLOCK</ion-label>
                    </ion-item-divider>
                    <ion-item lines="none">
                      <ion-label
                        class="addr"
                        @click="this.router.push(`/block/${info.transaction.header.block_number}`)"
                        >{{ info.transaction.header.block_number }}</ion-label
                      >
                    </ion-item>
                  </ion-item-group>
                </ion-list>
                <!-- KEYBASE end -->

                <!-- MS_CREATE start -->
                <ion-list v-if="info.transaction.tx.transactionType === 'multi_sig_create'">
                  <ion-list-header color="secondary"> MULTISIG_CREATE </ion-list-header>
                  <ion-item-group>
                    <ion-item-divider>
                      <ion-label>ADDRESS CREATED</ion-label>
                    </ion-item-divider>
                    <ion-item lines="none">
                      <ion-label class="addr" @click="this.router.push(`/a/${info.explorer.multisigAddress}`)">{{
                        info.explorer.multisigAddress
                      }}</ion-label>
                    </ion-item>
                  </ion-item-group>
                  <ion-item-divider>
                    <ion-label>CREATED BY</ion-label>
                  </ion-item-divider>
                  <ion-item lines="none">
                    <ion-label class="addr" @click="this.router.push(`/a/${info.transaction.addr_from}`)">{{
                      info.transaction.addr_from
                    }}</ion-label>
                  </ion-item>
                  <ion-item-group>
                    <ion-item-divider>
                      <ion-label>SIGNATORIES</ion-label>
                      <ion-note slot="end" class="subhead">WEIGHT</ion-note>
                    </ion-item-divider>
                    <ion-item lines="none" v-for="s in msCreate" v-bind:key="s.signatory">
                      <ion-label class="addr" @click="this.router.push(`/a/${s.signatory}`)">{{
                        s.signatory
                      }}</ion-label>
                      <ion-note slot="end" color="secondary">{{ s.weight }}</ion-note>
                    </ion-item>
                  </ion-item-group>
                  <ion-item-group>
                    <ion-item-divider>
                      <ion-label>THRESHOLD FOR SPEND</ion-label>
                    </ion-item-divider>
                    <ion-item lines="none">
                      <ion-label>{{ info.transaction.tx.multi_sig_create.threshold }}</ion-label>
                    </ion-item>
                  </ion-item-group>
                  <ion-item-group>
                    <ion-item-divider>
                      <ion-label>BLOCK</ion-label>
                    </ion-item-divider>
                    <ion-item lines="none">
                      <ion-label
                        class="addr"
                        @click="this.router.push(`/block/${info.transaction.header.block_number}`)"
                        >{{ info.transaction.header.block_number }}</ion-label
                      >
                    </ion-item>
                  </ion-item-group>
                </ion-list>
                <!-- MS_CREATE end -->

                <!-- <div class="ion-text-center">
              Transaction:<br>
                {{id}}<br>
                <div v-if="error !== null">Error: {{error.message}}</div>
                <div v-if="info !== null">
                  {{info}}
                </div>
                <div v-if="info === null && error === null">
                  <ion-spinner class="ion-text-center" color="secondary"></ion-spinner>
                </div>
            </div> -->
              </div>

              <div v-if="info === null && error === null">
                <ion-spinner class="ion-text-center" color="secondary"></ion-spinner>
              </div>
            </div>
          </ion-col>
        </ion-row>
        <ion-row>
          <ion-col>
            <Bookmark></Bookmark>
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-content>
  </ion-page>
</template>

<script lang="js">
import { IonGrid, IonCol, IonRow, IonButtons, IonIcon, IonSpinner, IonLabel, IonItem, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar, IonNote, IonList, IonItemGroup, IonItemDivider, IonListHeader, } from '@ionic/vue';
import { useRouter, useRoute } from 'vue-router';
import { checkmarkCircleOutline } from 'ionicons/icons';
import axios from 'axios';
import { DateTime } from 'luxon';
import helpers from '@theqrl/explorer-helpers'
import API from '../API';
import state from '../store';
import Bookmark from './Bookmark.vue'

// import { ref, computed, watch } from 'vue';

export default {
  name: 'Transaction',
  components: {
    IonGrid,
    IonCol,
    IonRow,
    IonButtons,
    IonNote,
    IonList,
    IonItemGroup,
    IonItemDivider,
    IonListHeader,
    // IonButton,
    IonContent,
    IonHeader,
    IonMenuButton,
    IonPage,
    IonTitle,
    IonToolbar,
    IonIcon,
    IonSpinner,
    IonLabel,
    // IonChip,
    IonItem,
    Bookmark
  },
  data() {
    const route = useRoute()
    return {
      sharedState: state,
      id: route.params.id,
      info: null,
      error: null,
      outputs: null,
      confirmed: false,
      msCreate: null
    }
  },
  setup() {
    const router = useRouter()
    return { router, checkmarkCircleOutline };
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
            this.error = { message: 'Transaction not found' }
          } else {
            const outputs = []
            const msCreate = []
            const formatted = helpers.tx(response.data)
            this.confirmed = formatted.explorer.confirmed
            if (formatted.transaction.tx.transactionType === 'transfer') {
              let total = 0
              formatted.transaction.tx.transfer.addrs_to.forEach((element, index) => {
                outputs.push({ addrTo: element, amount: formatted.transaction.tx.transfer.amounts[index] })
                total += parseInt(formatted.transaction.tx.transfer.amounts[index])
              })
              formatted.transaction.total = total
              this.outputs = outputs
            }
            if (formatted.transaction.tx.transactionType === 'multi_sig_create') {
              formatted.transaction.tx.multi_sig_create.signatories.forEach((element, index) => {
                msCreate.push({signatory: element, weight: formatted.transaction.tx.multi_sig_create.weights[index]})
              });
              this.msCreate = msCreate
            }
            console.log(formatted)
            this.info = formatted
          }
        })
        .catch(error => (this.error = error))
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
ion-chip .icon-color-primary {
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
.subhead {
  margin-right: 10px;
}
</style>
