<template>
  <v-container>
    <v-row>
      <v-col>
        <v-data-table :headers="headers" :items="clients" :search="search">
          <template v-slot:item.dateofbirth="{ item }">
            <span>{{
              new Date(item.dateofbirth) | dateFormat("YYYY-MM-DD")
            }}</span>
          </template>
          <template v-slot:top>
            <v-toolbar flat>
              <v-text-field
                v-model="search"
                single-line
                label="Поиск..."
              ></v-text-field>
              <v-spacer></v-spacer>
              <template>
                <router-link
                  style="text-decoration: none"
                  :to="`/register-new-user/`"
                >
                  <v-fab-transition>
                    <v-btn color="primary" dark absolute top right fab>
                      <v-icon>mdi-plus</v-icon>
                    </v-btn>
                  </v-fab-transition>
                </router-link>
              </template>
              
            </v-toolbar>
          </template>

          <template v-slot:[`item.actions`]="{ item }">
            <v-row>
              <v-col cols="5">
                <router-link
                  style="text-decoration: none"
                  :to="`/edit-user/${item.id}`"
                >
                  <v-btn class="mx-4" fab dark x-small color="primary">
                    <v-icon dark> mdi-pencil </v-icon>
                  </v-btn>
                </router-link>
              </v-col>
              
            </v-row>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      search: "",
      selectedItemIndex: -1,
      headers: [
        { text: "ID", value: "id", align: "center", width: "70px" },
        { text: "Фамилия", value: "surname", align: "center" },
        { text: "Имя", value: "firstname", align: "center" },
        { text: "Отчество", value: "patronymic", align: "center" },
        {
          text: "Дата рождения",
          value: "dateofbirth",
          dataType: "Date",
          align: "center",
          width: "160px",
        },
        { text: "Пол", value: "gender", align: "center", width: "80px" },
        {
          text: "Регистрация",
          value: "registration",
          align: "center",
          width: "150px",
        },
        { text: "Телефон", value: "phone", align: "center" },
        { text: "email", value: "email", align: "center" },
        { text: "", value: "actions", align: "center" },
      ],
      clients: [],
    };
  },

  methods: {
    
  },
  mounted() {
    axios
      .get("http://localhost:8080/api/user/")
      .then((response) => {
        this.clients = response.data;
      })
      .catch((error) => console.log(error));
  },
  created() {
    if (localStorage.getItem("id") == ''){
      this.$router.push('/login')
    }
  },
};
</script>

<style lang="scss" scoped>
::v-deep .v-data-table-header {
  border-color: #e3e7fa;
}
.v-data-table::v-deep th {
  font-size: 14px !important;
}
.v-data-table::v-deep td {
  font-size: 12px !important;
}
</style>