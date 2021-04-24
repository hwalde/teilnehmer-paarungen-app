<template>
  <div class="erlaubte-partner" :key="componentUpdate">
    <h1>Erlaubte Partner</h1>
    <div style="padding:1em">
      <ul class="nav nav-tabs nav-fill">
        <li class="nav-item">
          <a class="nav-link" v-bind:class="{'active':showAsTable}" href="#" v-on:click="showAsTable = true">Tabelle</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" v-bind:class="{'active':!showAsTable}" href="#" v-on:click="showAsTable = false">Text</a>
        </li>
      </ul>
      <div v-if="!showAsTable" class="block">
        <p v-for="(gruppe, index) in gruppenList" :key="index" style="text-align: left">
          {{gruppe.teilnehmer}} hat folgende erlaubte Partner:<br>{{gruppe.erlaubtePartner}}
        </p>
      </div>
      <div v-if="showAsTable" class="block">
        <table class="table">
          <thead>
          <tr>
            <th scope="col">Teilnehmer</th>
            <th scope="col">Erlaubte Partner</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(gruppe, index) in gruppenList" :key="index">
            <td>{{gruppe.teilnehmer}}</td>
            <td>{{gruppe.erlaubtePartner}}</td>
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
  name: 'ErlaubtePartner',
  // components: {
  //   HelloWorld,
  // },
  data() {
    return {
      componentUpdate:0,
      showAsTable:true,
      gruppenList:[] as {teilnehmer:string, erlaubtePartner:string}[],
    }
  },
  created() {
    gruppenListSubscription = Container()
        .getErlaubtePartnerService()
        .getTeilnehmer2ErlaubtePartnerMap$()
        .subscribe(teilnehmer2ErlaubtePartnerMap => {
      console.log("updated teilnehmer2ErlaubtePartnerMap:");
      console.log(teilnehmer2ErlaubtePartnerMap);
      this.gruppenList = [];
       teilnehmer2ErlaubtePartnerMap.forEach((value, key) => {
        this.gruppenList.push({teilnehmer:key, erlaubtePartner:value.join(", ")});
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

