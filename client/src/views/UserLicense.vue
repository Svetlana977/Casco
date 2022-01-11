<template>
  <div>
    <v-container fluid>
      <h2 v-if="!edit_" class="d-flex justify-center">
        Водительского удостоверения нет. Добавьте новое.
      </h2>
      <v-row v-else dense>
        <v-col v-for="(item_, idx) in items" :key="item_.id" :cols="4">
          <v-card>
            <v-card-text>
              <v-list>
                <v-list-item class="d-flex justify-center">
                  <h2>Водительское удостоверение {{ idx + 1 }}</h2>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>Номер:</v-list-item-title>
                    <v-list-item-subtitle>{{
                      item_.number1
                    }}</v-list-item-subtitle>

                    <v-list-item-title>Дата начала:</v-list-item-title>
                    <v-list-item-subtitle>{{
                      new Date(item_.datestart) | dateFormat("YYYY-MM-DD")
                    }}</v-list-item-subtitle>

                    <v-list-item-title>Дата окончания:</v-list-item-title>
                    <v-list-item-subtitle>{{
                      new Date(item_.dateend) | dateFormat("YYYY-MM-DD")
                    }}</v-list-item-subtitle>

                    <v-list-item-title>Подразделение:</v-list-item-title>
                    <v-list-item-subtitle>{{
                      item_.nameofthedivision
                    }}</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-card-text>
              <router-link
                style="text-decoration: none"
                :to="`/edit-license/${item_.id}/${idx}/${$route.params.id}`"
              >
                <v-btn
                v-show="!hidden"
                color="primary"
                dark
                absolute
                small
                top
                right
                fab
              >
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              </router-link>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <v-container>
      <v-row class="d-flex justify-end">
        <v-col cols="3">
          <router-link
            style="text-decoration: none"
            :to="`/register-new-license/${this.$route.params.id}`"
          >
            <v-fab-transition>
              <v-btn
                v-show="!hidden"
                color="primary"
                dark
                absolute
                top
                right
                fab
              >
                <v-icon>mdi-plus</v-icon>
              </v-btn>
            </v-fab-transition>
          </router-link>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
<script>
import axios from "axios";

export default {
  data() {
    return {
      items: {
        number1: "",
        dateStart: "",
        dateEnd: "",
        nameOfTheDivision: "",
      },
      edit_: false,
    };
  },
  components: {},
  created() {
    const id = this.$route.params.id;
    console.log(id);
    axios
      .get(`http://localhost:8080/api/drivelicense?id=${id}`)
      .then((response) => {
        this.edit_ = response.data.length == 0 ? false : true;
        this.items = response.data;
      })
      .catch((error) => {
        console.log(error);
      });
    if (localStorage.getItem("id") == ''){
      this.$router.push('/login')
    }
  
  },
};
</script>