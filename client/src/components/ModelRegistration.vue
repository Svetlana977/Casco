<template>
  <v-form v-model="valid">
    <v-container v-if="model">
      <h1 class="text-center mb-10">Создание модели автомобиля</h1>
      <v-row align="center" justify="center">
        <v-col cols="3">
          <v-text-field
            v-model="editedItem.namemodel"
            :rules="nameRules"
            @keypress="isLetter($event)"
            label="Модель"
          ></v-text-field>
        </v-col>
        <v-col cols="3">
          <v-autocomplete
            v-model="name_"
            :rules="markRules"
            label="Марка"
            :items="marks"
            @change="changeIdMark()"
          >
          </v-autocomplete>
        </v-col>
        <v-col cols="3">
          <v-text-field
            v-model="editedItem.coefmodel"
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
              <p v-if="success">Модель создана успешно</p>
              <p v-if="!success">Модель не создана</p>
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
              <p>Модель уже создана</p>
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
      model: null,
      dialog: false,
      dialog2: false,
      isOperationSuccess: false,
      editedItem: {
        namemodel: "",
        id_mark: "",
        coefmodel: "",
      },
      name_: "",
      marks_arr: [],
      marks: [],
      activeMark: "",
      valid: false,
      canpost: false,
      nameRules: [
        (v) => !!v || "Поле обязательно для заполнения",
        (v) => v.toString().length > 1 || "Должно быть больше 1 символа",
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
      markRules: [(v) => !!v || "Поле обязательно для заполнения"],
    };
  },
  computed: {
    success() {
      return this.isOperationSuccess;
    },
  },
  methods: {
    changeIdMark() {
      for (let i = 0; i < this.marks_arr.length; i++) {
        if (this.marks_arr[i].name_ == this.name_) {
          this.activeMark = this.marks_arr[i].id;
        }
      }
      return this.activeMark;
    },
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
      if (/^[A-Za-z0-9]+$/.test(char)) return true;
      else e.preventDefault();
    },
    editItem(item) {
      this.editedItem = Object.assign({}, item);
    },
    save() {
      this.canpost = true;
      axios
        .get(`http://localhost:8080/api/model/${this.activeMark}`)
        .then((response) => {
          let arr_models = [];
          response.data.forEach((item) => {
            arr_models.push(item.namemodel);
          });
          for (let i = 0; i < arr_models.length; i++) {
            if (this.editedItem.namemodel == arr_models[i]) {
              this.canpost = false;
              break;
            } 
          }
          if (!this.canpost){
            this.dialog2 = true
          }
          else {
            this.canpost = false;
            axios({
              method: "post",
              url: "http://localhost:8080/api/model/",
              data: {
                namemodel: this.editedItem.namemodel,
                id_mark: this.activeMark,
                coefmodel: this.editedItem.coefmodel,
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

    this.model = this.editedItem;
    console.log(this.model);

    axios
      .get(`http://localhost:8080/api/mark/`)
      .then((response) => {
        this.marks_arr = response.data;
        response.data.forEach((item) => {
          this.marks.push(item.name_);
        });
      })
      .catch((error) => {
        console.log(error);
      });
  },
};
</script>