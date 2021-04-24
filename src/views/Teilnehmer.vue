<template>
  <div class="teilnehmer" :key="componentUpdate">
    <h1>Teilnehmer</h1>
    <table class="table">
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">Name</th>
          <th scope="col">Aktion(en)</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(teilnehmerName, index) in teilnehmerList" :key="teilnehmerName">
          <th scope="row">{{index + 1}}</th>
          <td>{{teilnehmerName}}</td>
          <td><button type="button" class="btn" @click="removeTeilnehmer(teilnehmerName)">Entfernen</button></td>
        </tr>
      </tbody>
    </table>
<!--    <div class="mb-3">
      <label for="exampleFormControlInput1" class="form-label">Email address</label>
      <input type="email" class="form-control" id="exampleFormControlInput1" placeholder="name@example.com">
    </div>-->
    <input type="text" v-model="teilnehmer"><button type="button" class="btn btn-primary" @click="addTeilnehmer()">Hinzufügen</button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Container from "@/Container";
import {Subscription} from "rxjs";
// import HelloWorld from '@/components/HelloWorld.vue'; // @ is an alias to /src

let teilnehmerListSubscription:Subscription;

export default defineComponent({
  name: 'Teilnehmer',
  // components: {
  //   HelloWorld,
  // },
  data() {
    return {
      componentUpdate: 0,
      teilnehmerList:[] as string[],
      teilnehmer:''
    }
  },
  created() {
    teilnehmerListSubscription = Container().getTeilnehmerService().getTeilnehmerList$().subscribe(teilnehmerList => {
      console.log("updated teilnehmerList:");
      console.log(teilnehmerList);
      this.teilnehmerList = teilnehmerList;
      this.componentUpdate++;
    });
  },
  unmounted() {
    if(teilnehmerListSubscription) {
      teilnehmerListSubscription.unsubscribe();
    }
  },
  methods: {
    addTeilnehmer() {
      Container().getTeilnehmerService().addTeilnehmer(this.teilnehmer);
      this.teilnehmer = '';
    },
    removeTeilnehmer(teilnehmerName:string) {
      Container().getTeilnehmerService().removeTeilnehmer(teilnehmerName);
    }
  }
});
</script>
