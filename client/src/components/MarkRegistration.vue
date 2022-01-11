<template>
  <v-form v-model="valid">
    <v-container v-if="mark">
      <h1 class="text-center mb-10">Создание марки автомобиля</h1>
      <v-row align="center" justify="center">
        <v-col cols="3">
          <v-text-field
            v-model="editedItem.name_"
            :rules="nameRules"
            @keypress="isLetter($event)"
            label="Марка"
          ></v-text-field>
        </v-col>
        <v-col cols="3">
          <v-text-field
            v-model="editedItem.coef"
            :rules="coefRules"
            @keypress="isNumber($event)"
            label="Коэффициент"
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
              <p v-if="success">Марка создана успешно</p>
              <p v-if="!success">Марка не создана</p>
            </v-card-title>

            <v-card-text>
              <p v-if="success">Изменения зафиксированы</p>
              <p v-if="!success">Попробуйте снова</p>
            </v-card-text>

            <v-divider></v-divider>
          </v-card>
        </v-dialog>
        <v-dialog v-model="dialog2" width="500">
          <v-card>
            <v-card-title>
              <p>Марка уже создана</p>
            </v-card-title>
          </v-card>
        </v-dialog>
      </v-row>
    </v-container>
  </v-form>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      mark: null,
      dialog: false,
      dialog2: false,
      isOperationSuccess: false,
      editedItem: {
        name_: "",
        coef: "",
      },
      valid: false,
      marks_arr: [],
      marks: [],
      nameRules: [
        (v) => !!v || "Поле обязательно для заполнения",
        (v) => v.toString().length > 3 || "Должно быть больше 3 символов",
        (v) => v.toString().length < 20 || "Должно быть меньше 20 символов",
      ],
      coefRules: [
        (v) => !!v || "Поле обязательно для заполнения",
        (v) => v.toString().length >= 3 || "Формат записи *.*",
        (v) =>
          v.toString().length < 6 || "Допускается только 3 знака после запятой",
        (v) => v < 10 || "Должно быть меньше 10.0",
        (v) => v > 0 || "Должно быть больше 0.0",
      ],
    };
  },
  computed: {
    success() {
      return this.isOperationSuccess;
    },
  },
  methods: {
    isNumber(evt) {
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
    isLetter(e) {
      let char = String.fromCharCode(e.keyCode);
      if (/^[A-Za-z]+$/.test(char)) return true;
      else e.preventDefault();
    },
    editItem(item) {
      this.editedItem = Object.assign({}, item);
    },
    save() {
      this.canpost = true;
      axios
        .get(`http://localhost:8080/api/mark/`)
        .then((response) => {
          let arr_marks = [];
          response.data.forEach((item) => {
            arr_marks.push(item.name_);
          });
          for (let i = 0; i < arr_marks.length; i++) {
            if (this.editedItem.name_ == arr_marks[i]) {
              this.canpost = false;
              break;
            }
          }

          if (!this.canpost) {
            this.dialog2 = true;
          } else {
            this.canpost = false;
            console.log("created");
            axios({
              method: "post",
              url: "http://localhost:8080/api/mark/",
              data: {
                name_: this.editedItem.name_,
                coef: this.editedItem.coef,
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
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
  created() {
    if (localStorage.getItem("id") == "") {
      this.$router.push("/login");
    }

    this.mark = this.editedItem;
    console.log(this.mark);
  },
};
</script>