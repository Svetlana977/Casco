<template>
  <v-form v-model="valid">
    <v-container v-if="license">
      <h1 class="text-center mb-10" v-if="registrat">
        Создание водительского удостоверения
      </h1>
      <h1 class="text-center mb-10" v-if="edit">
        Редактирование водительского удостоверения
      </h1>

      <v-row align="center" justify="center">
        <v-col cols="3">
          <v-text-field
            v-model="editedItem.number1"
            :rules="number_Rules"
            label="Номер"
            @keypress="filter(event)"
          ></v-text-field>
        </v-col>
        <v-col cols="3">
          <v-menu
            v-model="menu2"
            :close-on-content-click="false"
            :nudge-right="40"
            transition="scale-transition"
            offset-y
            min-width="auto"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-if="firstDate"
                v-model="datePickerFormattedDate"
                label="Дата начала"
                prepend-icon="mdi-calendar"
                readonly
                :rules="dateRules"
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
              <v-text-field
                v-else
                v-model="date"
                label="Дата начала"
                prepend-icon="mdi-calendar"
                readonly
                :rules="dateRules"
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="date"
              :value="datePickerFormattedDate"
              @input="
                menu2 = false;
                firstDate = false;
              "
            ></v-date-picker>
          </v-menu>
        </v-col>
        <v-col cols="3">
          <v-menu
            v-model="menu1"
            :close-on-content-click="false"
            :nudge-right="40"
            transition="scale-transition"
            offset-y
            min-width="auto"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-if="firstDate1"
                v-model="datePickerFormattedDate1"
                label="Дата окончания"
                prepend-icon="mdi-calendar"
                readonly
                :rules="dateRules"
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
              <v-text-field
                v-else
                v-model="date1"
                label="Дата окончания"
                prepend-icon="mdi-calendar"
                readonly
                :rules="dateRules"
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="date1"
              :value="datePickerFormattedDate1"
              @input="
                menu1 = false;
                firstDate1 = false;
              "
            ></v-date-picker>
          </v-menu>
        </v-col>

        <v-col cols="3">
          <v-text-field
            v-model="editedItem.nameofthedivision"
            :rules="divisionRules"
            label="Подразделение"
          ></v-text-field>
        </v-col>
        
      </v-row>

      <v-row>
        <v-spacer></v-spacer>

        <v-col cols="5.5">
          <v-btn color="primary" @click.stop="save" :disabled="!valid"
            >Сохранить</v-btn
          >
        </v-col>

        <v-dialog v-model="dialog" width="500">
          <v-card>
            <v-card-title>
              <p v-if="success && registrat">Удостоверение создано успешно</p>
              <p v-if="!success && registrat">Удостоверение не создано</p>
              <p v-if="success && edit">Редактирование удостоверения успешно</p>
              <p v-if="!success && edit">
                Не удалось произвести редактирование удостоверения
              </p>
            </v-card-title>

            <v-card-text>
              <p v-if="success">Изменения зафиксированы</p>
              <p v-if="!success">Попробуйте снова</p>
            </v-card-text>

            <v-divider></v-divider>
          </v-card>
        </v-dialog>
      </v-row>
    </v-container>
  </v-form>
</template>

<script>
import axios from "axios";
import moment from "moment";

export default {
  props: {
    registrat: {
      type: Boolean,
      default: false,
    },
    edit: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      license: null,
      dialog: false,
      isOperationSuccess: false,
      editedItem: {
        number1: "",
        dateStart: "",
        dateEnd: "",
        nameofthedivision: "",
      },
      date: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
        .toISOString()
        .substr(0, 10),
      date1: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
        .toISOString()
        .substr(0, 10),
      firstDate: true,
      firstDate1: true,
      menu2: false,
      menu1: false,
      valid: false,
      dateRules: [(v) => !!v || "Поле обязательно для заполнения"],
      divisionRules: [
        (v) => !!v || "Поле обязательно для заполнения",
        (v) => v.toString().length <= 255 || "Должно быть меньше 255 символов",
        (v) => v.toString().length >= 10 || "Должно быть больше 10 символов",
      ],
      number_Rules: [
        (v) => !!v || "Поле обязательно для заполнения",
        (v) => v.toString().length == 10 || "Должно быть 10 символов",
      ],
    };
  },
  computed: {
    success() {
      return this.isOperationSuccess;
    },
    datePickerFormattedDate() {
      return this.editedItem.datestart
        ? moment(this.editedItem.datestart).format("YYYY-MM-DD")
        : undefined; // Date picker objects needs date in this particular format
    },
    datePickerFormattedDate1() {
      return this.editedItem.dateend
        ? moment(this.editedItem.dateend).format("YYYY-MM-DD")
        : undefined; // Date picker objects needs date in this particular format
    },
  },
  methods: {
    filter(evt) {
      evt = (evt) ? evt : window.event;
      var charCode = (evt.which) ? evt.which : evt.keyCode;
      if ((charCode > 31 && (charCode < 48 || charCode > 57)) && charCode !== 46) {
        evt.preventDefault();
      } else {
        return true;
      }
    },
    editItem(item) {
      this.editedItem = Object.assign({}, item);
    },
    save() {
      if (this.registrat) {
        axios({
          method: "post",
          url: "http://localhost:8080/api/drivelicense/",
          data: {
            number1: this.editedItem.number1,
            dateStart: this.date,
            dateEnd: this.date1,
            nameOfTheDivision: this.editedItem.nameofthedivision,
            id_customer: this.$route.params.id,
          },
        })
          .then((response) => {
            this.isOperationSuccess = true;
            this.dialog = true;
            console.log(response.data);
          })
          .catch((error) => {
            this.isOperationSuccess = false;
            this.dialog = true;
            console.log(error);
          });
      }

      if (this.edit) {
         const id = this.$route.params.id;
        const idclient = this.$route.params.idclient;
        axios({
          method: "put",
          url: `http://localhost:8080/api/drivelicense`,
          data: {
            id,
            number1: this.editedItem.number1,
            dateStart: this.date,
            dateEnd: this.date1,
            nameOfTheDivision: this.editedItem.nameofthedivision,
            id_customer: idclient,
          },
        })
          .then((response) => {
            this.isOperationSuccess = true;
            this.dialog = true;
            console.log(response.data);
          })
          .catch((error) => console.log(error));
      }
    },
  },
  created() {
    if (this.edit) {
      const id = this.$route.params.idclient;
      const num = this.$route.params.num;
      axios
        .get(`http://localhost:8080/api/drivelicense/?id=${id}`)
        .then((response) => {
          this.license = response.data[num];
          this.editItem(this.license);
          //console.log(response.data);
        })
        .catch((error) => {
          console.log(error);
        });     
    }

    if (this.registrat) {
      this.license = this.editedItem;
      console.log(this.license);
    }
    if (localStorage.getItem("id") == ''){
      this.$router.push('/login')
    }
  
  },
};
</script>