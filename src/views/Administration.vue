<template>
  <div class="startseite">
    <h1>Administration</h1>
    <div>
      <ul>
        <li><br><a class="good-link" href="#" v-on:click="exportBackup()">Backup erstellen</a><br><br></li>
        <li><a class="dangerous-link" href="#" v-on:click="importBackup()">Backup importieren</a><br></li>
        <li><a class="dangerous-link" href="#" v-on:click="eraseAllData()">Alle Daten unwiderruflich löschen</a></li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import Container from "@/Container";

export default defineComponent({
  name: 'Administration',
  setup() {
    const exportBackup = (): void => {
      Container().getExportImportService().export("backup.json", () => {
        alert("Backup erfolgreich gespeichert");
      }, (errorMessage) => {
        alert("Es trat ein Fehler beim Anlegen des Backups auf: " + errorMessage);
      });
    };

    const importBackup = (): void => {
      const doBackup = confirm("Warnung dies wird alle Daten unwiderruflich überschreiben. Möchtest du wirklich fortfahren?");
      if (!doBackup) {
        return; // do nothing
      }
      Container().getExportImportService().import("backup.json", () => {
        alert("Backup erfolgreich eingespielt");
      }, (errorMessage) => {
        alert("Es trat ein Fehler beim Einspielen des Backups auf: " + errorMessage);
      });
    };

    const eraseAllData = (): void => {
      const doBackup = confirm("Warnung dies wird alle Daten unwiderruflich löschen. Möchtest du wirklich fortfahren?");
      if (!doBackup) {
        return; // do nothing
      }
      Container().getDatabaseService().eraseAllData();
      Container().getDatabaseService().save();
      Container().getTeilnehmerService().reload();
      Container().getVerbotenePaarungenService().reload();
      alert("Es wurden alle Daten gelöscht!");
    };

    return {
      exportBackup,
      importBackup,
      eraseAllData,
    }
  }
});
</script>

<style>
ul {
  list-style: none;
}

li {
  padding: 0.3em;
}

.dangerous-link {
  color: red;
}

.good-link {
  color: #00b300;
  font-weight: bold;
}
</style>
