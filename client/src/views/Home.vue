<template>
  <v-app>
  </v-app>    
</template>

<script>

export default {
  name: 'Home',
  created() {
    if (localStorage.getItem("id") == ''){
      this.$router.push('/login')
    }
  },
};
</script>
