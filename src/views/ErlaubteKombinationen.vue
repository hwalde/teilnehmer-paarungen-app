<template>
  <div class="erlaubte-partner" :key="componentUpdate">
    <h1>Erlaubte Kombinationen</h1>
    <div style="padding:1em">
      <div class="block">
        <table class="table" v-for="(kombination, index) in kombinationList" :key="index">
          <thead>
          <tr>
            <th scope="col">Teilnehmer</th>
            <th scope="col">Erlaubte Kombinationen</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(pair, index) in kombination" :key="index">
            <td>{{ pair.teilnehmer }}</td>
            <td>{{ pair.partner }}</td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent, onMounted, onUnmounted, ref} from 'vue';
import Container from "@/Container";
import {Subscription} from "rxjs";

export default defineComponent({
  name: 'ErlaubteKombinationen',
  setup() {
    const componentUpdate = ref(0);
    const showAsTable = ref(true);
    const kombinationList = ref([] as { teilnehmer: string, partner: string }[][]);

    let gruppenListSubscription: Subscription;

    onMounted(() => {
      gruppenListSubscription = Container()
          .getErlaubteKombinationenService()
          .getErlaubteKombinationenList$()
          .subscribe(erlaubteKombinationenList => {
            console.log("updated erlaubteKombinationenList:");
            console.log(erlaubteKombinationenList);
            kombinationList.value = [];
            erlaubteKombinationenList.forEach(erlaubteKombination => {
              const teilnehmerWithoutPartner: string[] = [];
              erlaubteKombination.forEach((partner, teilnehmer) => {
                if (partner === undefined) {
                  teilnehmerWithoutPartner.push(teilnehmer);
                }
              });

              const kombination: { teilnehmer: string, partner: string }[] = [];
              erlaubteKombination.forEach((partner, teilnehmer) => {
                kombination.push({
                  teilnehmer,
                  partner: partner ?? teilnehmerWithoutPartner.filter(currentTeilnehmer => currentTeilnehmer != teilnehmer).join(" oder ")
                });
              })
              kombinationList.value.push(kombination);
            });
            componentUpdate.value++;
          });
    });

    onUnmounted(() => {
      if (gruppenListSubscription) {
        gruppenListSubscription.unsubscribe();
      }
    });

    return {
      componentUpdate,
      showAsTable,
      kombinationList
    }
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

