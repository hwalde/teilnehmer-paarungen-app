<template>
  <div class="berechnen" :key="componentUpdate">
    <h1>Verbotene Paarungen</h1>
    <table class="table">
      <thead>
      <tr>
        <th scope="col">#</th>
        <th scope="col">Paarung</th>
        <th scope="col">Aktion(en)</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(verbotenePaarung, index) in verbotenePaarungList" :key="verbotenePaarung">
        <th scope="row">{{index + 1}}</th>
        <td>{{verbotenePaarung.teilnehmer1}} und {{verbotenePaarung.teilnehmer2}}</td>
        <td><button type="button" class="btn" @click="removeVerbotenePaarung(verbotenePaarung)">Entfernen</button></td>
      </tr>
      </tbody>
    </table>

    <select class="form-select" v-model="verbotenePaarung.teilnehmer1">
      <option disabled value="">Bitte Teilnehmer auswählen</option>
      <option v-for="(teilnehmer, index) in teilnehmerList" :key="index" :selected="teilnehmer === verbotenePaarung.teilnehmer1">{{teilnehmer}}</option>
    </select>
    <select class="form-select" v-model="verbotenePaarung.teilnehmer2">
      <option disabled value="">Bitte den verbotenen Partner auswählen</option>
      <option v-for="(teilnehmer, index) in teilnehmerList" :key="index" :selected="teilnehmer === verbotenePaarung.teilnehmer2">{{teilnehmer}}</option>
    </select>

    <button type="button" class="btn btn-primary" @click="addVerbotenePaarung()">Hinzufügen</button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Container from "@/Container";
import {Subscription} from "rxjs";
import {Paarung} from "@/domain/Paarung";
// import HelloWorld from '@/components/HelloWorld.vue'; // @ is an alias to /src

let verbotenePaarungListSubscription:Subscription;
let teilnehmerListSubscription:Subscription;

export default defineComponent({
  name: 'VerbotenePaarungen',
  // components: {
  //   HelloWorld,
  // },
  data() {
    return {
      componentUpdate: 0,
      verbotenePaarungList:[] as Paarung[],
      teilnehmerList:[] as string[],
      verbotenePaarung:{teilnehmer1: "", teilnehmer2: ""} as Paarung
    }
  },
  created() {
    teilnehmerListSubscription = Container().getTeilnehmerService().getTeilnehmerList$().subscribe(teilnehmerList => {
      console.log("updated teilnehmerList:");
      console.log(teilnehmerList);
      this.teilnehmerList = teilnehmerList;
      this.componentUpdate++;
    });
    verbotenePaarungListSubscription = Container().getVerbotenePaarungenService().getVerbotenePaarungenList$().subscribe(verbotenePaarungList => {
      console.log("updated verbotenePaarungList:");
      console.log(verbotenePaarungList);
      this.verbotenePaarungList = verbotenePaarungList;
      this.componentUpdate++;
    });
  },
  unmounted() {
    if(verbotenePaarungListSubscription) {
      verbotenePaarungListSubscription.unsubscribe();
    }
    if(teilnehmerListSubscription) {
      teilnehmerListSubscription.unsubscribe();
    }
  },
  methods: {
    addVerbotenePaarung() {
      Container().getVerbotenePaarungenService().addVerbotenePaarung({teilnehmer1: this.verbotenePaarung.teilnehmer1, teilnehmer2: this.verbotenePaarung.teilnehmer2} as Paarung);
      this.verbotenePaarung.teilnehmer1 = '';
      this.verbotenePaarung.teilnehmer2 = '';
    },
    removeVerbotenePaarung(verbotenePaarung:Paarung) {
      Container().getVerbotenePaarungenService().removeVerbotenePaarung(verbotenePaarung);
    }
  }
});
</script>
