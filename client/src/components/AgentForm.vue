<template>
  <v-form v-model="valid">
    <v-container v-if="user">
      <h1 class="text-center mb-10" v-if="registrat">
        Создание учетной записи
      </h1>
      <h1 class="text-center mb-10" v-if="edit">
        Редактирование учетной записи
      </h1>

      <v-row>
        <v-col cols="4">
          <v-text-field
            v-model="editedItem.surname_"
            :rules="nameRules"
            label="Фамилия"
          ></v-text-field>
        </v-col>
        <v-col cols="4">
          <v-text-field
            v-model="editedItem.firstname_"
            :rules="nameRules"
            label="Имя"
          ></v-text-field>
        </v-col>
        <v-col cols="4">
          <v-text-field
            v-model="editedItem.patronymic_"
            label="Отчество"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row align="center" justify="center">
          
        <v-col cols="2">
          <v-text-field
            v-model="editedItem.login_"
            :rules="loginRules"
            label="Логин"
          ></v-text-field>
        </v-col>
        <v-col cols="2">
          <v-text-field
            v-model="editedItem.password_"
            :rules="passwordRules"
            label="Пароль"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row align="center" justify="center">
          <v-checkbox label="Работает" v-model="editedItem.work" @click="log()"> </v-checkbox>
      </v-row>

      <v-row>
        <v-col cols="5.5">
          <v-btn color="primary" @click.stop="save" :disabled="!valid"
            >Сохранить</v-btn
          >
        </v-col>

        <v-dialog v-model="dialog" width="500">
          <v-card>
            <v-card-title>
              <p v-if="success && registrat">Учетная запись создана успешно</p>
              <p v-if="!success && registrat">Учетная запись не создана</p>
              <p v-if="success && edit">
                Редактирование учетной записи успешно
              </p>
              <p v-if="!success && edit">
                Не удалось произвести редактирование учетной записи
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
      dialog: false,
      isOperationSuccess: false,
      workList: ["да", "нет"],
      editedItem: {
        surname_: "",
        firstname_: "",
        patronymic_: "",
        work: "",
        login_: "",
        password_: "",
      },
      id: this.$route.params.id,
      valid: false,
      nameRules: [
        (v) => !!v || "Поле обязательно для заполнения",
        (v) => v.length <= 40 || "Должно быть меньше 40 символов",
        (v) => v.length >= 3 || "Должно быть больше 3 символов",
      ],
      workRules: [(v) => !!v || "Поле обязательно для заполнения"],
      loginRules: [
        (v) => !!v || "Поле обязательно для заполнения",
        (v) => v.length <= 12 || "Должно быть меньше 12 символов",
        (v) => v.length >= 4 || "Должно быть больше 4 символов",
      ],
      passwordRules: [
        (v) => !!v || "Поле обязательно для заполнения",
        (v) => v.length <= 10 || "Должно быть меньше 10 символов",
        (v) => v.length >= 4 || "Должно быть больше 4 символов",
      ],
    };
  },
  computed: {
    success() {
      return this.isOperationSuccess;
    },
  },
  methods: {
      log(){
          console.log(this.editedItem);
      },
    editItem(item) {
      this.editedItem = Object.assign({}, item);
    },
    save() {
      if (this.registrat) {
        axios({
          method: "post",
          url: "http://localhost:8080/api/agent/",
          data: {
            surname_: this.editedItem.surname_,
            firstname_: this.editedItem.firstname_,
            patronymic_: this.editedItem.patronymic_,
            work: this.editedItem.work,
            login_: this.editedItem.login_,
            password_: this.editedItem.password_,
          },
        })
          .then((response) => {
            this.isOperationSuccess = true;
            this.dialog = true;
            this.id = response.data.id;
            console.log(response.data);
            this.$router.push(`/edit-agent/${this.id}`);
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
          url: `http://localhost:8080/api/agent`,
          data: {
            id,
            surname_: this.editedItem.surname_,
            firstname_: this.editedItem.firstname_,
            patronymic_: this.editedItem.patronymic_,
            work: this.editedItem.work,
            login_: this.editedItem.login_,
            password_: this.editedItem.password_,
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
        .get(`http://localhost:8080/api/agent/${id}`)
        .then((response) => {
          this.user = response.data;
          this.editItem(this.user);
          console.log(this.editedItem);
        })
        .catch((error) => {
          console.log(error);
        });
    }

    if (this.registrat) {
      this.user = this.editedItem;
    }
    if (localStorage.getItem("id") == "") {
      this.$router.push("/login");
    }
  },
};
</script>