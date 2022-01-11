<template>
  <v-container>
    <v-row>
      <v-col>
        <v-data-table :headers="headers" :items="policies" :search="search">
          <template v-slot:item.datestart_="{ item }">
            <span>{{ new Date(item.datestart_) | dateFormat("YYYY-MM-DD") }}</span>
          </template>
          <template v-slot:item.dateend_="{ item }">
            <span>{{ new Date(item.dateend_) | dateFormat("YYYY-MM-DD") }}</span>
          </template>
          <template v-slot:item.damagetheft="{ item }">
            <span>{{ item.damagetheft == true ? 'да' : 'нет' }}</span>
          </template>
          <template v-slot:item.onlydamage="{ item }">
            <span>{{ item.onlydamage == true ? 'да' : 'нет' }}</span>
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
          <template v-slot:[`item.actions`]="{ item }">
            <v-row>              
              <v-col cols="1">
                <v-btn class="mx-1" fab dark x-small>
                  <v-icon class="mr-0.5" @click="createItem(item)">
                    mdi-printer
                  </v-icon>
                </v-btn>
              </v-col>
            </v-row>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
    <v-dialog
            v-model="dialog"
            fullscreen
            hide-overlay
            transition="dialog-bottom-transition"
          >
            <v-card>
              <v-toolbar dark color="primary">
                <v-btn
                  icon
                  dark
                  @click="
                    dialog = false;
                  "
                >
                  <v-icon>mdi-close</v-icon>
                </v-btn>
                <v-toolbar-title>Полис КАСКО</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-toolbar-items>
                  <v-btn
                    dark
                    text
                    @click="printPolicy()"
                  >
                    Печать
                  </v-btn>
                </v-toolbar-items>
              </v-toolbar>
              <div id="divtoprint2">
                <v-list three-line subheader>
                  <v-subheader>Полис</v-subheader>
                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title>Номер</v-list-item-title>
                      <v-list-item-subtitle>{{
                        this.policy.numerpolic
                      }}</v-list-item-subtitle>
                      <v-list-item-title>Дата начала</v-list-item-title>
                      <v-list-item-subtitle>{{
                        new Date(this.policy.datestart_) | dateFormat("YYYY-MM-DD")
                      }}</v-list-item-subtitle>
                      <v-list-item-title>Дата окончания</v-list-item-title>
                      <v-list-item-subtitle>{{
                        new Date(this.policy.dateend_)
                          | dateFormat("YYYY-MM-DD")
                      }}</v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
                <v-divider></v-divider>
                <v-list three-line subheader>
                  <v-subheader>Данные клиента</v-subheader>
                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title>ФИО</v-list-item-title>
                      <v-list-item-subtitle>{{
                        `${this.policy.surname} ${this.policy.firstname} ${this.policy.patronymic}`
                      }}</v-list-item-subtitle>
                      <v-list-item-title>Дата рождения</v-list-item-title>
                      <v-list-item-subtitle>{{
                        new Date(this.policy.dateofbirth)
                          | dateFormat("YYYY-MM-DD")
                      }}</v-list-item-subtitle>                      
                      <v-list-item-title>Пол</v-list-item-title>
                      <v-list-item-subtitle>{{
                        this.policy.gender
                      }}</v-list-item-subtitle>
                      <v-list-item-title>Регистрация</v-list-item-title>
                      <v-list-item-subtitle>{{
                        this.policy.registration
                      }}</v-list-item-subtitle>
                      <v-list-item-title>Телефон</v-list-item-title>
                      <v-list-item-subtitle>{{
                        this.policy.phone
                      }}</v-list-item-subtitle>
                      <v-list-item-title>email</v-list-item-title>
                      <v-list-item-subtitle>{{
                        this.policy.email
                      }}</v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
                <v-divider></v-divider>
                <v-list three-line subheader>
                  <v-subheader>Данные ТС</v-subheader>
                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title>VIN</v-list-item-title>
                      <v-list-item-subtitle>{{
                        this.policy.vin
                      }}</v-list-item-subtitle>
                      <v-list-item-title>Марка</v-list-item-title>
                      <v-list-item-subtitle>{{
                        this.policy.name_
                      }}</v-list-item-subtitle>
                      <v-list-item-title>Модель</v-list-item-title>
                      <v-list-item-subtitle>{{
                        this.policy.namemodel
                      }}</v-list-item-subtitle>
                      <v-list-item-title>Год выпуска</v-list-item-title>
                      <v-list-item-subtitle>{{
                        this.policy.year
                      }}</v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
                <v-divider></v-divider>
                <v-list three-line subheader>
                  <v-subheader>Страховка</v-subheader>
                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title>Риски</v-list-item-title>
                      <v-list-item-subtitle>{{
                        this.policy.onlydamage == true ? "Только ущерб" : "Ущерб и угон"
                      }}</v-list-item-subtitle>
                      <v-list-item-subtitle>{{
                        this.policy.franchise == true
                          ? `Франшиза: ${this.policy.sumfranchise} ₽`
                          : "Франшиза не выбрана"
                      }}</v-list-item-subtitle>
                      <v-list-item-subtitle>{{
                        `Сумма страховки ${this.policy.cost} ₽`
                      }}</v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </div>
            </v-card>
          </v-dialog>
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
        { text: "Номер полиса", value: "numerpolic", align: "center" },
        { text: "Дата начала", value: "datestart_", align: "center" },
        { text: "Дата окончания", value: "dateend_", align: "center" },
        { text: "Только ущерб", value: "onlydamage", align: "center" },
        { text: "Ущерб и угон", value: "damagetheft", align: "center" },
        { text: "Сумма франшизы", value: "sumfranchise", align: "center" },        
        { text: "VIN ТС", value: "vin", align: "center" },
        { text: "Фамилия клиента", value: "surname", align: "center" },
        { text: "Имя клиента", value: "firstname", align: "center" },
        { text: "", value: "actions", align: "center" },
      ],
      policies: [],
      policy: {
        numerpolic: '',
        datestart_: '',
        dateend_: '',
        surname: '',
        firstname: '',
        patronymic: '',
        dateofbirth: '',
        gender: '',
        registration: '',
        phone: '',
        email: '',
        vin: '',
        name_: '',
        namemodel: '',
        year: '',
        onlydamage: '',
        franchise: '',
        sumfranchise: '',
        cost: ''
      },
      dialog: false,
    };
  },

  methods: {
    createItem(item){
      this.dialog = true
      console.log(`http://localhost:8080/api/policy/${item.id}`);
      axios
      .get(`http://localhost:8080/api/policy/${item.id}`)
      .then((response) => {
        this.policy = response.data[0];
        console.log(response.data);
      })
      .catch((error) => console.log(error));
    },
    printPolicy() {
      var DocumentContainer = document.getElementById("divtoprint2");
      var WindowObject = window.open(
        "",
        "PrintWindow",
        "width=750,height=650,top=50,left=50,toolbars=no,scrollbars=yes,status=no,resizable=yes"
      );
      WindowObject.document.writeln(DocumentContainer.innerHTML);
      WindowObject.document.close();
      setTimeout(function () {
        WindowObject.focus();
        WindowObject.print();
        WindowObject.close();
      }, 6000);
    },
  },
  mounted() {
    axios
      .get("http://localhost:8080/api/policy/")
      .then((response) => {
        this.policies = response.data;
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