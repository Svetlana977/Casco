<template>
  <div>
    <v-container fluid>
      <h2 v-if="!edit_" class="d-flex justify-center">
        Транспортного средства нет. Добавьте первое.
      </h2>
      <v-row v-else dense>
        <v-col v-for="(item_, idx) in itemsCar" :key="item_.vin" :cols="4">
          <v-card>
            <v-card-text>
              <v-list>
                <v-list-item class="d-flex justify-center">
                  <h2>ТС {{ idx + 1 }}</h2>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>VIN номер:</v-list-item-title>
                    <v-list-item-subtitle>{{
                      itemsCar[idx].vin
                    }}</v-list-item-subtitle>

                    <v-list-item-title>Марка:</v-list-item-title>
                    <v-list-item-subtitle>{{
                      itemsCar[idx].name_
                    }}</v-list-item-subtitle>

                    <v-list-item-title>Модель:</v-list-item-title>
                    <v-list-item-subtitle>{{
                      itemsCar[idx].namemodel
                    }}</v-list-item-subtitle>

                    <v-list-item-title>Год:</v-list-item-title>
                    <v-list-item-subtitle>{{
                      itemsCar[idx].year
                    }}</v-list-item-subtitle>

                    <v-list-item-title>Категория:</v-list-item-title>
                    <v-list-item-subtitle>{{
                      itemsCar[idx].category
                    }}</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-card-text>
              <router-link
                style="text-decoration: none"
                :to="`/edit-car/${item_.id}/${idx}/${$route.params.id}`"
              >
                <v-btn
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
            :to="`/register-new-car/${this.$route.params.id}`"
          >
            <v-fab-transition>
              <v-btn
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
      itemsCar: {
        id: "",
        id_category_: "",
        id_model_: "",
        id_mark_: "",
        vin: "",
        name_: "",
        namemodel: "",
        year: "",
        category: "",
        id_customer_: "",
      },
      edit_: false,
    };
  },
  components: {},
  created() {
    const id = this.$route.params.id;
    axios
      .get(`http://localhost:8080/api/car/${id}`)
      .then((response) => {
        this.edit_ = response.data.length == 0 ? false : true;
        this.itemsCar = response.data;
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