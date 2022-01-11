<template>
  <v-form v-model="valid">
    <v-container v-if="passport">
      <h1 class="text-center mb-10" v-if="registrat">Создание паспорта</h1>
      <h1 class="text-center mb-10" v-if="edit">Редактирование паспорта</h1>

      <v-row align="center" justify="center">
        <v-col cols="3">
          <v-text-field
            v-model="editedItem.series"
            :rules="seriesRules"
            label="Серия"
            @keypress="filter(event)"
          ></v-text-field>
        </v-col>
        <v-col cols="3">
          <v-text-field
            v-model="editedItem.number_"
            :rules="number_Rules"
            label="Номер"
            @keypress="filter(event)"
          ></v-text-field>
        </v-col>
        <v-col cols="3">
          <v-text-field
            v-model="editedItem.code"
            :rules="number_Rules"
            label="Код подразделения"
            @keypress="filter(event)"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row align="center" justify="center">
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
                label="Дата выдачи"
                prepend-icon="mdi-calendar"
                readonly
                :rules="dateRules"
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
              <v-text-field
                v-else
                v-model="date"
                label="Дата выдачи"
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

        <v-col cols="7">
          <v-text-field
            v-model="editedItem.issued"
            :rules="issuedRules"
            label="Выдан"
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
              <p v-if="success && registrat">Паспорт создан успешно</p>
              <p v-if="!success && registrat">Паспорт не создан</p>
              <p v-if="success && edit">Редактирование паспорта успешно</p>
              <p v-if="!success && edit">
                Не удалось произвести редактирование паспорта
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
      passport: null,
      dialog: false,
      isOperationSuccess: false,
      editedItem: {
        series: "",
        number_: "",
        dateOfIssue: "",
        issued: "",
        code: "",
        id_customer: "",
      },
      date: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
        .toISOString()
        .substr(0, 10),
      firstDate: true,
      menu2: false,
      valid: false,
      dateRules: [(v) => !!v || "Поле обязательно для заполнения"],
      issuedRules: [
        (v) => !!v || "Поле обязательно для заполнения",
        (v) => v.length <= 255 || "Должно быть меньше 255 символов",
        (v) => v.length >= 10 || "Должно быть больше 10 символов",
      ],
      seriesRules: [
        (v) => v.length.toString() == 4 || "Должно быть 4 символа",
        (v) => !!v || "Поле обязательно для заполнения",
      ],
      number_Rules: [
        (v) => !!v || "Поле обязательно для заполнения",
        (v) => v.toString().length == 6 || "Должно быть 6 символов",
      ],
    };
  },
  computed: {
    success() {
      return this.isOperationSuccess;
    },
    datePickerFormattedDate() {
      return this.editedItem.dateofissue
        ? moment(this.editedItem.dateofissue).format("YYYY-MM-DD")
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
          url: "http://localhost:8080/api/passport/",
          data: {
            series: this.editedItem.series,
            number_: this.editedItem.number_,
            dateOfIssue: this.date,
            issued: this.editedItem.issued,
            code: this.editedItem.code,
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
          url: `http://localhost:8080/api/passport`,
          data: {
            id,
            series: this.editedItem.series,
            number_: this.editedItem.number_,
            dateOfIssue: this.date,
            issued: this.editedItem.issued,
            code: this.editedItem.code,
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
        .get(`http://localhost:8080/api/passport/?id=${id}`)
        .then((response) => {
          this.passport = response.data[num];
          this.editItem(this.passport);
          console.log(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }

    if (this.registrat) {
      this.passport = this.editedItem;
    }
    if (localStorage.getItem("id") == ''){
      this.$router.push('/login')
    }
  
  },
};
</script>