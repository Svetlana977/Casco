<template>
  <v-container>
    <v-row align="center" justify="center">
      <v-col cols="1">
        <router-link style="text-decoration: none" :to="`/register-new-user/`">
          <v-fab-transition>
            <v-btn color="primary" dark fab>
              <v-icon>mdi-plus</v-icon>
            </v-btn>
          </v-fab-transition>
        </router-link>
      </v-col>
      <v-col cols="3">
        <h3>Клиенты</h3>
      </v-col>
    </v-row>
    <v-row align="center" justify="center">
      <v-col cols="1">
        <router-link style="text-decoration: none" :to="`/register-new-mark/`">
          <v-fab-transition>
            <v-btn color="primary" dark fab>
              <v-icon>mdi-plus</v-icon>
            </v-btn>
          </v-fab-transition>
        </router-link>
      </v-col>
      <v-col cols="3">
        <h3>Марки автомобиля</h3>
      </v-col>
    </v-row>
    <v-row align="center" justify="center">
      <v-col cols="1">
        <router-link style="text-decoration: none" :to="`/register-new-model/`">
          <v-fab-transition>
            <v-btn color="primary" dark fab>
              <v-icon>mdi-plus</v-icon>
            </v-btn>
          </v-fab-transition>
        </router-link>
      </v-col>
      <v-col cols="3">
        <h3>Модели автомобиля</h3>
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
      dialogDelete: false,
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
    deleteItem(item) {
      console.log(item);
      this.selectedItemIndex = this.clients.indexOf(item);
      this.dialogDelete = true;
    },
    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.selectedItemIndex = -1;
      });
    },
    deleteItemConfirm() {
      const deleteClient = this.clients[this.selectedItemIndex];
      axios
        .delete(`http://localhost:8080/api/user/${deleteClient.id}`)
        .then((response) => {
          this.clients.splice(this.selectedItemIndex, 1);
          this.closeDelete();
          console.log("DELETE SUCCESS", response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
  mounted() {
    axios
      .get("http://localhost:8080/api/user/")
      .then((response) => {
        this.clients = response.data;
        //console.log(this.clients[1]);
        //console.log(Date.parse(this.clients[1].dateofbirth));
      })
      .catch((error) => console.log(error));
  },
  created() {
    if (localStorage.getItem("id") == "") {
      this.$router.push("/login");
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