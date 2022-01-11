<template>
  <v-container>
    <v-row>
      <v-col>
        <v-data-table :headers="headers" :items="agents" :search="search">
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
                  :to="`/register-new-agent/`"
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
                  :to="`/edit-agent/${item.id}`"
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
        { text: "Фамилия", value: "surname_", align: "center" },
        { text: "Имя", value: "firstname_", align: "center" },
        { text: "Отчество", value: "patronymic_", align: "center" },
        { text: "Работает", value: "work", align: "center" },
        { text: "Логин", value: "login_", align: "center" },
        { text: "Пароль", value: "password_", align: "center" },
        { text: "", value: "actions", align: "center" },
      ],
      agents: [],
    };
  },

  methods: {
    
  },
  mounted() {
    axios
      .get("http://localhost:8080/api/agent/")
      .then((response) => {
        this.agents = response.data;
        //console.log(this.clients[1]);
        //console.log(Date.parse(this.clients[1].dateofbirth));
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