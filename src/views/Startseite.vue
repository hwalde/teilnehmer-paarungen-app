<template>
  <div class="startseite">
    <h1>Startseite</h1>
    <p>Bitte folgende Daten eingeben:</p>
    <ul>
      <li><router-link to="/teilnehmer">Teilnehmer</router-link></li>
      <li><router-link to="/verbotene-paarungen">Verbotene Paarungen</router-link></li>
    </ul>
    <p>Daraus werden automatisch folgende Daten erzeugt:</p>
    <ul>
      <li><router-link to="/erlaubte-partner">Erlaubte Partner</router-link></li>
      <li><router-link to="/erlaubte-kombinationen">Erlaubte Kombinationen</router-link></li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
// import HelloWorld from '@/components/HelloWorld.vue'; // @ is an alias to /src

export default defineComponent({
  name: 'Startseite',
  // components: {
  //   HelloWorld,
  // },
});
</script>

<style>
ul {
  list-style: none;
}
</style>
