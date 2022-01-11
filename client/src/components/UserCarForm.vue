<template>
  <v-form v-model="valid">
    <v-container v-if="car">
      <h1 class="text-center mb-10" v-if="registrat">
        Создание транспортного средства
      </h1>
      <h1 class="text-center mb-10" v-if="edit">
        Редактирование транспортного средства
      </h1>

      <v-row align="center" justify="center">
        <v-col cols="3">
          <v-text-field
            v-model="editedItem.vin"
            :rules="vinRules"
            @keypress="isLetterOrNumber($event)"
            @input="upperCaseText(editedItem.vin)"
            label="VIN"
          ></v-text-field>
        </v-col>
        <v-col cols="3">
          <v-autocomplete
            v-model="editedItem.name_"
            :rules="modelRules"
            label="Марка"
            :items="marks"
            @change="changeModel()"
          >
          </v-autocomplete>
        </v-col>
        <v-col cols="3">
          <v-autocomplete
            v-model="editedItem.namemodel"
            :rules="modelRules"
            label="Модель"
            :items="models"
            @change="changeIdModel()"
          >
          </v-autocomplete>
        </v-col>
      </v-row>
      <v-row align="center" justify="center">
        <v-col cols="3">
          <v-text-field
            v-model="editedItem.year"
            :rules="yearRules"
            @keypress="isNumber($event)"
            label="Год"
          ></v-text-field>
        </v-col>
        <v-col cols="3">
          <v-autocomplete
            v-model="editedItem.category"
            :rules="modelRules"
            label="Категория"
            :items="categories"
            @change="changeIdCategory()"
          >
          </v-autocomplete>
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
              <p v-if="success && registrat">ТС создано успешно</p>
              <p v-if="!success && registrat">ТС не создано</p>
              <p v-if="success && edit">Редактирование ТС успешно</p>
              <p v-if="!success && edit">
                Не удалось произвести редактирование ТС
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
      car: null,
      dialog: false,
      isOperationSuccess: false,
      editedItem: {
        vin: "",
        name_: "",
        namemodel: "",
        year: "",
        category: "",
      },
      marks_arr: [],
      marks: [],
      activeMark: "",
      activeModel: "",
      activeCategory: "",
      models_arr: [],
      models: [],
      category_arr: [],
      categories: [],
      valid: false,
      vinRules: [
        (v) => !!v || "Поле обязательно для заполнения",
        (v) => v.toString().length == 17 || "Должно быть 17 символов",
      ],
      yearRules: [
        (v) => !!v || "Поле обязательно для заполнения",
        (v) => v.toString().length == 4 || "Должно быть 4 символа",
        (v) =>
          v <= new Date().getFullYear() ||
          `Год должен быть меньше или равен текущему ${new Date().getFullYear()}`,
      ],
      modelRules: [(v) => !!v || "Поле обязательно для заполнения"],
    };
  },
  computed: {
    success() {
      return this.isOperationSuccess;
    },
  },
  methods: {
    changeIdCategory() {
      for (let i = 0; i < this.category_arr.length; i++) {
        if (this.category_arr[i].category == this.editedItem.category) {
          this.activeCategory = this.category_arr[i].id;
        }
      }
      return this.activeCategory;
    },
    changeIdMark() {
      for (let i = 0; i < this.marks_arr.length; i++) {
        if (this.marks_arr[i].name_ == this.editedItem.name_) {
          this.activeMark = this.marks_arr[i].id;
        }
      }
      return this.activeMark;
    },
    changeIdModel() {
      for (let i = 0; i < this.models_arr.length; i++) {
        if (this.models_arr[i].namemodel == this.editedItem.namemodel) {
          this.activeModel = this.models_arr[i].id;
        }
      }
      return this.activeModel;
    },
    changeModel() {
      this.changeIdMark();
      this.editedItem.namemodel = null;
      axios
        .get(`http://localhost:8080/api/model/${this.activeMark}`)
        .then((response) => {
          this.models = [];
          this.models_arr = response.data;
          response.data.forEach((item) => {
            this.models.push(item.namemodel);
          });
        })
        .catch((error) => console.log(error));
      console.log(this.editedItem.id_category);
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
    isLetterOrNumber(e) {
      let char = String.fromCharCode(e.keyCode);
      if (/^[A-Za-z0-9]+$/.test(char)) return true;
      else e.preventDefault();
    },
    upperCaseText(newValue) {
      this.editedItem.vin = newValue.toUpperCase();
    },
    editItem(item) {
      this.editedItem = Object.assign({}, item);
    },
    save() {
      this.changeIdCategory();
      this.changeIdMark();
      this.changeIdModel();
      if (this.registrat) {
        const id = this.$route.params.id;
        axios({
          method: "post",
          url: "http://localhost:8080/api/car/",
          data: {
            VIN: this.editedItem.vin,
            year: this.editedItem.year,
            id_category_: this.activeCategory,
            id_model_: this.activeModel,
            id_mark_: this.activeMark,
            id_customer_: id,
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
          url: `http://localhost:8080/api/car`,
          data: {
            id,
            VIN: this.editedItem.vin,
            year: this.editedItem.year,
            id_category_: this.activeCategory,
            id_model_: this.activeModel,
            id_mark_: this.activeMark,
            id_customer_: idclient,
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
    if (localStorage.getItem("id") == ''){
      this.$router.push('/login')
    }
  
    if (this.edit) {
      const id = this.$route.params.idclient;
      const num = this.$route.params.num;
      axios
        .get(`http://localhost:8080/api/car/${id}`)
        .then((response) => {
          this.car = response.data[num];
          this.editItem(this.car);
          const idmarktemp = response.data[num].id_mark;

          axios
            .get(`http://localhost:8080/api/model/${idmarktemp}`)
            .then((response) => {
              this.models_arr = response.data;
              response.data.forEach((item) => {
                this.models.push(item.namemodel);
              });
            });
        })
        .catch((error) => {
          console.log(error);
        });
    }

    if (this.registrat) {
      this.car = this.editedItem;
      console.log(this.car);
    }

    axios.get(`http://localhost:8080/api/mark/`).then((response) => {
      this.marks_arr = response.data;
      response.data.forEach((item) => {
        this.marks.push(item.name_);
      });
    });
    axios
      .get(`http://localhost:8080/api/category`)
      .then((response) => {
        this.category_arr = response.data;
        response.data.forEach((item) => {
          this.categories.push(item.category);
        });
      })
      .catch((error) => {
        console.log(error);
      });
  },
};
</script>