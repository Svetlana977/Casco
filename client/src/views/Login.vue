<template>
  <main>
    <v-container class="loginOverlay">
      <v-layout flex align-center justify-center>
        <v-flex xs12 sm4 elevation-6>
          <v-toolbar color="#6A76AB" dark>
            <v-toolbar-title class="white--text"
              ><h4>Авторизация</h4></v-toolbar-title
            >
          </v-toolbar>
          <v-card>
            <v-card-text class="pt-4">
              <div>
                <v-form v-model="valid" ref="form">
                  <v-select
                    v-model="items_arr.login_"
                    :items="logins"
                    label="Логин"
                    :rules="rules"
                    required
                  ></v-select>
                  <v-text-field
                    label="Пароль"
                    v-model="items_arr.password_"
                    :rules="rules"
                    type="password"
                    required
                  ></v-text-field>
                  <v-layout justify-space-between>
                    <v-btn
                      @click="submit"
                      text
                      color="#6A76AB"
                      :class="{
                        disabled: !valid,
                      }"
                      >Войти</v-btn
                    >
                  </v-layout>
                </v-form>
              </div>
            </v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
    <v-dialog v-model="dialog" width="500">
      <v-card>
        <v-card-title>
          <p>Некорректный пароль</p>
        </v-card-title>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialog2" width="500">
      <v-card>
        <v-card-title>
          <p>Доступ запрещен</p>
        </v-card-title>
      </v-card>
    </v-dialog>
  </main>
</template>

<script>
import axios from "axios";

export default {
  components: {},
  data() {
    return {
      valid: false,
      rules: [(v) => !!v || "Поле обязательно для заполнения"],
      items_arr: {
        id: "",
        surname_: "",
        firstname_: "",
        patronymic_: "",
        work: "",
        login_: "",
        password_: "",
      },
      logins: [],
      agentCurrent: {
        id: "",
        surname_: "",
        firstname_: "",
      },
      dialog: false,
      dialog2: false,
    };
  },
  methods: {
    submit() {
      if (this.$refs.form.validate()) {
        for (let i = 0; i < this.items_arr.length; i++) {
          if (
            this.items_arr[i].login_ == this.items_arr.login_ &&
            this.items_arr[i].password_ == this.items_arr.password_ &&
            this.items_arr[i].work == true
          ) {
            this.agentCurrent = this.items_arr[i];

            localStorage.setItem("id", this.agentCurrent.id);
            localStorage.setItem("surname_", this.agentCurrent.surname_);
            localStorage.setItem("firstname_", this.agentCurrent.firstname_);

            this.$router.push("/");
          } else if (
            this.items_arr[i].login_ == this.items_arr.login_ &&
            this.items_arr[i].password_ == this.items_arr.password_ &&
            this.items_arr[i].work == false
          ) {
            this.dialog2 = true;
          } else if (
            this.items_arr[i].login_ == this.items_arr.login_ &&
            this.items_arr[i].password_ !== this.items_arr.password_
          ) {
            this.dialog = true;
          }
        }
      }
    },
  },
  mounted() {
    axios
      .get("http://localhost:8080/api/agent/")
      .then((response) => {
        this.items_arr = response.data;
        response.data.forEach((item) => {
          this.logins.push(item.login_);
        });
      })
      .catch((error) => console.log(error));
  },
};
</script>