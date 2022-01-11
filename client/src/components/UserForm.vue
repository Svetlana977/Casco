<template>
  <v-form v-model="valid">
    <v-container v-if="user">
      <h1 class="text-center mb-10" v-if="registrat">Создание клиента</h1>
      <h1 class="text-center mb-10" v-if="edit">Редактирование клиента</h1>

      <v-row>
        <v-col cols="4">
          <v-text-field
            v-model="editedItem.surname"
            :rules="nameRules"
            label="Фамилия"
          ></v-text-field>
        </v-col>
        <v-col cols="4">
          <v-text-field
            v-model="editedItem.firstname"
            :rules="nameRules"
            label="Имя"
          ></v-text-field>
        </v-col>
        <v-col cols="4">
          <v-text-field
            v-model="editedItem.patronymic"
            label="Отчество"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
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
                label="Дата рождения"
                prepend-icon="mdi-calendar"
                readonly
                :rules="dateRules"
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
              <v-text-field
                v-else
                v-model="date"
                label="Дата рождения"
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
        <v-col cols="2">
          <v-select
            v-model="editedItem.gender"
            :rules="genderRules"
            :items="genderList"
            label="Пол"
          >
          </v-select>
        </v-col>
        <v-col cols="7">
          <v-text-field
            v-model="editedItem.registration"
            :rules="registrationRules"
            label="Регистрация"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row align="center" justify="center">
        <v-col cols="4">
          <v-text-field
            v-model="editedItem.phone"
            :rules="phoneRules"
            label="Телефон"
            @keypress="filter(event)"
          ></v-text-field>
        </v-col>
        <v-col cols="4">
          <v-text-field v-model="editedItem.email" label="email"></v-text-field>
        </v-col>
      </v-row>

      <!-- Actions button -->
      <v-row>
        <v-col cols="1.2">
          <v-col cols="5">
            <v-btn
              v-if="registrat"
              class="ma-2"
              outlined
              color="indigo"
              disabled
              >Паспорт</v-btn
            >
            <router-link
              v-else
              style="text-decoration: none"
              :to="`/passport/${id}`"
            >
              <v-btn class="ma-2" outlined color="indigo">Паспорт</v-btn>
            </router-link>
          </v-col>
        </v-col>
        <v-col cols="3.2">
          <v-col cols="5">
            <v-btn
              v-if="registrat"
              class="ma-2"
              outlined
              color="indigo"
              disabled
              >Водительское удостоверение</v-btn
            >
            <router-link
              v-else
              style="text-decoration: none"
              :to="`/license/${id}`"
            >
              <v-btn class="ma-2" outlined color="indigo"
                >Водительское удостоверение</v-btn
              >
            </router-link>
          </v-col>
        </v-col>
        <v-col cols="5">
          <v-col cols="5">
            <v-btn
              v-if="registrat"
              class="ma-2"
              outlined
              color="indigo"
              disabled
              >Автомобиль</v-btn
            >
            <router-link
              v-else
              style="text-decoration: none"
              :to="`/car/${id}`"
            >
              <v-btn class="ma-2" outlined color="indigo">Автомобиль</v-btn>
            </router-link>
          </v-col>
        </v-col>
        <v-col cols="5.5">
          <v-btn color="primary" @click.stop="save" :disabled="!valid"
            >Сохранить</v-btn
          >
        </v-col>

        <v-dialog v-model="dialog" width="500">
          <v-card>
            <v-card-title>
              <p v-if="success && registrat">Клиент создан успешно</p>
              <p v-if="!success && registrat">Клиент не создан</p>
              <p v-if="success && edit">Редактирование клиента успешно</p>
              <p v-if="!success && edit">
                Не удалось произвести редактирование клиента
              </p>
            </v-card-title>

            <v-card-text>
              <p v-if="success">Изменения отражены в таблице</p>
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
      user: null,
      genderList: ["жен", "муж"],
      dialog: false,
      isOperationSuccess: false,
      editedItem: {
        surname: "",
        firstname: "",
        patronymic: "",
        dateOfBirth: "",
        gender: "",
        registration: "",
        phone: "",
        email: "",
      },
      id: this.$route.params.id,
      date: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
        .toISOString()
        .substr(0, 10),
      firstDate: true,
      menu2: false,
      valid: false,
      nameRules: [
        (v) => !!v || "Поле обязательно для заполнения",
        (v) => v.length <= 40 || "Должно быть меньше 50 символов",
        (v) => v.length >= 3 || "Должно быть больше 3 символов",
      ],
      genderRules: [(v) => !!v || "Поле обязательно для заполнения"],
      dateRules: [(v) => !!v || "Поле обязательно для заполнения"],
      registrationRules: [
        (v) => !!v || "Поле обязательно для заполнения",
        (v) => v.length <= 255 || "Должно быть меньше 255 символов",
        (v) => v.length >= 10 || "Должно быть больше 10 символов",
      ],
      phoneRules: [
        (v) => !!v || "Поле обязательно для заполнения",
        (v) => v.length == 11 || "Должно быть 11 символов",
      ],
    };
  },
  computed: {
    success() {
      return this.isOperationSuccess;
    },
    datePickerFormattedDate() {
      return this.editedItem.dateofbirth
        ? moment(this.editedItem.dateofbirth).format("YYYY-MM-DD")
        : undefined; // Date picker objects needs date in this particular format
    },
  },
  methods: {
    filter(evt) {
      evt = evt ? evt : window.event;
      var charCode = evt.which ? evt.which : evt.keyCode;
      if (
        charCode > 31 &&
        (charCode < 48 || charCode > 57) &&
        charCode !== 46
      ) {
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
          url: "http://localhost:8080/api/user/",
          data: {
            surname: this.editedItem.surname,
            firstname: this.editedItem.firstname,
            patronymic: this.editedItem.patronymic,
            dateOfBirth: this.date,
            gender: this.editedItem.gender,
            registration: this.editedItem.registration,
            phone: this.editedItem.phone,
            email: this.editedItem.email,
          },
        })
          .then((response) => {
            this.isOperationSuccess = true;
            this.dialog = true;
            this.id = response.data.id;
            console.log(response.data);
            this.$router.push(`/edit-user/${this.id}`);
          })
          .catch((error) => {
            this.isOperationSuccess = false;
            this.dialog = true;
            console.log(error);
          });
      }

      if (this.edit) {
        const id = this.$route.params.id;
        axios({
          method: "put",
          url: `http://localhost:8080/api/user`,
          data: {
            id,
            surname: this.editedItem.surname,
            firstname: this.editedItem.firstname,
            patronymic: this.editedItem.patronymic,
            dateOfBirth: this.date,
            gender: this.editedItem.gender,
            registration: this.editedItem.registration,
            phone: this.editedItem.phone,
            email: this.editedItem.email,
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
      const id = this.$route.params.id;
      axios
        .get(`http://localhost:8080/api/user/${id}`)
        .then((response) => {
          this.user = response.data;
          this.editItem(this.user);
        })
        .catch((error) => {
          console.log(error);
        });
    }

    if (this.registrat) {
      this.user = this.editedItem;
    }
    if (localStorage.getItem("id") == ''){
      this.$router.push('/login')
    }
  
  },
};
</script>