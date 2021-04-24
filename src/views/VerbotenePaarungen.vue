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
        <th scope="row">{{ index + 1 }}</th>
        <td>{{ verbotenePaarung.teilnehmer1 }} und {{ verbotenePaarung.teilnehmer2 }}</td>
        <td>
          <button type="button" class="btn" @click="removeVerbotenePaarung(verbotenePaarung)">Entfernen</button>
        </td>
      </tr>
      </tbody>
    </table>

    <select class="form-select" v-model="verbotenePaarung.teilnehmer1">
      <option disabled value="">Bitte Teilnehmer auswählen</option>
      <option v-for="(teilnehmer, index) in teilnehmerList" :key="index"
              :selected="teilnehmer === verbotenePaarung.teilnehmer1">{{ teilnehmer }}
      </option>
    </select>
    <select class="form-select" v-model="verbotenePaarung.teilnehmer2">
      <option disabled value="">Bitte den verbotenen Partner auswählen</option>
      <option v-for="(teilnehmer, index) in teilnehmerList" :key="index"
              :selected="teilnehmer === verbotenePaarung.teilnehmer2">{{ teilnehmer }}
      </option>
    </select>

    <button type="button" class="btn btn-primary" @click="addVerbotenePaarung()">Hinzufügen</button>
  </div>
</template>

<script lang="ts">
import {defineComponent, onMounted, onUnmounted, ref} from 'vue';
import Container from "@/Container";
import {Subscription} from "rxjs";
import {Paarung} from "@/domain/Paarung";

export default defineComponent({
  name: 'VerbotenePaarungen',
  setup() {
    const componentUpdate = ref(0);
    const verbotenePaarungList = ref([] as Paarung[]);
    const teilnehmerList = ref([] as string[]);
    const verbotenePaarung = ref({teilnehmer1: "", teilnehmer2: ""} as Paarung);

    let verbotenePaarungListSubscription: Subscription;
    let teilnehmerListSubscription: Subscription;

    onMounted(() => {
      teilnehmerListSubscription = Container().getTeilnehmerService().getTeilnehmerList$().subscribe(newTeilnehmerList => {
        console.log("updated teilnehmerList:");
        console.log(teilnehmerList);
        teilnehmerList.value = newTeilnehmerList;
        componentUpdate.value++;
      });
      verbotenePaarungListSubscription = Container().getVerbotenePaarungenService().getVerbotenePaarungenList$().subscribe(newVerbotenePaarungList => {
        console.log("updated verbotenePaarungList:");
        console.log(verbotenePaarungList);
        verbotenePaarungList.value = newVerbotenePaarungList;
        componentUpdate.value++;
      });
    });

    onUnmounted(() => {
      if (verbotenePaarungListSubscription) {
        verbotenePaarungListSubscription.unsubscribe();
      }
      if (teilnehmerListSubscription) {
        teilnehmerListSubscription.unsubscribe();
      }
    });

    const addVerbotenePaarung = (): void => {
      Container().getVerbotenePaarungenService().addVerbotenePaarung({
        teilnehmer1: verbotenePaarung.value.teilnehmer1,
        teilnehmer2: verbotenePaarung.value.teilnehmer2
      } as Paarung);
      verbotenePaarung.value.teilnehmer1 = '';
      verbotenePaarung.value.teilnehmer2 = '';
    };
    const removeVerbotenePaarung = (verbotenePaarung: Paarung): void => {
      Container().getVerbotenePaarungenService().removeVerbotenePaarung(verbotenePaarung);
    }

    return {
      componentUpdate,
      verbotenePaarungList,
      teilnehmerList,
      verbotenePaarung,
      addVerbotenePaarung,
      removeVerbotenePaarung
    }
  },
});
</script>
