<template>
  <div class="erlaubte-partner" :key="componentUpdate">
    <h1>Erlaubte Kombinationen</h1>
    <div style="padding:1em">
      <div  class="block">
        <table class="table" v-for="(kombination, index) in kombinationList" :key="index">
          <thead>
          <tr>
            <th scope="col">Teilnehmer</th>
            <th scope="col">Erlaubte Kombinationen</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(pair, index) in kombination" :key="index">
            <td>{{pair.teilnehmer}}</td>
            <td>{{pair.partner}}</td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Container from "@/Container";
import {Subscription} from "rxjs";
// import HelloWorld from '@/components/HelloWorld.vue'; // @ is an alias to /src

let gruppenListSubscription:Subscription;

export default defineComponent({
  name: 'ErlaubteKombinationen',
  // components: {
  //   HelloWorld,
  // },
  data() {
    return {
      componentUpdate:0,
      showAsTable:true,
      kombinationList:[] as {teilnehmer:string, partner:string}[][],
    }
  },
  created() {
    gruppenListSubscription = Container()
        .getErlaubteKombinationenService()
        .getErlaubteKombinationenList$()
        .subscribe(erlaubteKombinationenList => {
      console.log("updated erlaubteKombinationenList:");
      console.log(erlaubteKombinationenList);
      this.kombinationList = [];
      erlaubteKombinationenList.forEach(erlaubteKombination => {
        const teilnehmerWithoutPartner:string[] = [];
        erlaubteKombination.forEach((partner, teilnehmer) => {
          if(partner === undefined) {
            teilnehmerWithoutPartner.push(teilnehmer);
          }
        });

        const kombination:{teilnehmer:string, partner:string}[] = [];
        erlaubteKombination.forEach((partner, teilnehmer) => {
          kombination.push({teilnehmer, partner:partner ?? teilnehmerWithoutPartner.filter(currentTeilnehmer => currentTeilnehmer != teilnehmer).join(" oder ")});
        })
        this.kombinationList.push(kombination);
      });
      this.componentUpdate++;
    });
  },
  unmounted() {
    if(gruppenListSubscription) {
      gruppenListSubscription.unsubscribe();
    }
  },
  methods: {

  }
});
</script>

<style scoped>
.block {
  padding: 1em;
  border: 1px solid #dee2e6;
  border-top: 0;
}
</style>

