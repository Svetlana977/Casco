<template>
  <v-container>
    <v-row>
      <v-col>
        <v-data-table :headers="headers" :items="docs" :search="search">
          <template v-slot:item.date_="{ item }">
            <span>{{ new Date(item.date_) | dateFormat("YYYY-MM-DD") }}</span>
          </template>
          <template v-slot:top>
            <v-toolbar flat>
              <v-text-field
                v-model="search"
                single-line
                label="Поиск..."
              ></v-text-field>
              <v-spacer></v-spacer>
            </v-toolbar>
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
        { text: "Номер договора", value: "numerdoc", align: "center" },
        { text: "Дата", value: "date_", align: "center" },
        { text: "VIN ТС", value: "vin", align: "center" },
        { text: "Фамилия клиента", value: "surname", align: "center" },
        { text: "Имя клиента", value: "firstname", align: "center" },
        
      ],
      docs: [],
    };
  },

  methods: {},
  mounted() {
    axios
      .get(`http://localhost:8080/api/doc/${localStorage.id}`)
      .then((response) => {
        this.docs = response.data;
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