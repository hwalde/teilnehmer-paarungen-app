<template>
  <div id="nav">
    <router-link to="/">Startseite</router-link> |
    <router-link to="/teilnehmer">Teilnehmer verwalten</router-link> |
    <router-link to="/verbotene-paarungen">Verbotene Paarungen verwalten</router-link> |
    <router-link to="/erlaubte-partner">Erlaubte Partner</router-link> |
    <router-link to="/erlaubte-kombinationen">Erlaubte Kombinationen</router-link> |
    <router-link to="/administration">Administration</router-link>
  </div>
  <router-view/>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
