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
        <th scope="row">{{ index + 1 }}</th>
        <td>{{ teilnehmerName }}</td>
        <td>
          <button type="button" class="btn" @click="removeTeilnehmer(teilnehmerName)">Entfernen</button>
        </td>
      </tr>
      </tbody>
    </table>
    <input type="text" v-model="teilnehmer">
    <button type="button" class="btn btn-primary" @click="addTeilnehmer()">Hinzufügen</button>
  </div>
</template>

<script lang="ts">
import {defineComponent, onMounted, onUnmounted, ref} from 'vue';
import Container from "@/Container";
import {Subscription} from "rxjs";

export default defineComponent({
  name: 'Teilnehmer',

  setup() {
    const componentUpdate = ref(0);
    const teilnehmerList = ref([] as string[]);
    const teilnehmer = ref('');

    let teilnehmerListSubscription: Subscription;

    onMounted(() => {
      teilnehmerListSubscription = Container().getTeilnehmerService().getTeilnehmerList$().subscribe(newTeilnehmerList => {
        console.log("updated teilnehmerList:");
        console.log(teilnehmerList);
        teilnehmerList.value = newTeilnehmerList;
        componentUpdate.value++;
      });
    });

    onUnmounted(() => {
      if (teilnehmerListSubscription) {
        teilnehmerListSubscription.unsubscribe();
      }
    });

    const addTeilnehmer = (): void => {
      Container().getTeilnehmerService().addTeilnehmer(teilnehmer.value);
      teilnehmer.value = '';
    };

    const removeTeilnehmer = (teilnehmerName: string): void => {
      Container().getTeilnehmerService().removeTeilnehmer(teilnehmerName);
    };

    return {
      componentUpdate,
      teilnehmerList,
      teilnehmer,
      addTeilnehmer,
      removeTeilnehmer
    }
  }
});
</script>
