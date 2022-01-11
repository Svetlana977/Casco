<template>
  <v-app>
    <Navbar />
    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>
import Navbar from "./components/Navbar.vue";

export default {
  name: "App",
  components: {
    Navbar,
  },
  created() {
    localStorage.setItem("id", "");
    localStorage.setItem("surname_", "");
    localStorage.setItem("firstname_", "");
  },
};
</script>
