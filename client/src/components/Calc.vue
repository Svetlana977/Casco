<template>
  <v-form>
    <v-row>
      <v-col cols="8">
        <v-data-table
          :headers="headers"
          :items="items_arr"
          :search="search"
          v-model="selected"
          single-select
          show-select
          :footer-props="{
            itemsPerPageOptions: [5, 20, 30, -1],
          }"
        >
          <template>
            <tr>
              <th>
                <v-checkbox
                  primary
                  hide-details
                  @click="checkSelection()"
                ></v-checkbox>
              </th>
            </tr>
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
      <v-col cols="3">
        <v-container>
          <v-card>
            <v-card-text>
              <h3 class="d-flex justify-center">Условия страхования:</h3>
              <v-radio-group v-model="radios" mandatory row>
                <v-radio
                  label="Ущерб и угон"
                  @click="checkSelection()"
                ></v-radio>
                <v-radio
                  label="Только ущерб"
                  @click="checkSelection()"
                ></v-radio>
              </v-radio-group>
              <v-row>
                <v-checkbox
                  v-model="checkbox"
                  hide-details
                  @click="checkSelection()"
                >
                </v-checkbox>
                <v-text-field
                  v-model="sumFranc"
                  @keypress="isNumber($event)"
                  label="Сумма франшизы"
                  :disabled="!checkbox"
                  :rules="sumRules"
                  @input="checkSelection()"
                ></v-text-field>
              </v-row>
            </v-card-text>
            <v-card-actions class="d-flex justify-center">
              <v-btn text color="primary" @click="calcSum()" :disabled="!valid"
                >Рассчитать</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-container>
        <v-container>
          <v-card>
            <v-card-text>
              <h3 class="d-flex justify-center">Сумма полиса КАСКО:</h3>
              <div>
                <h2 class="text--primary d-flex justify-center">
                  {{ sumcasco == "" ? 0 : sumcasco }} ₽
                </h2>
              </div>
            </v-card-text>
          </v-card>
        </v-container>

        <v-row justify="center">
          <v-dialog v-model="dialog2" persistent max-width="600px">
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                text
                color="primary"
                dark
                v-bind="attrs"
                v-on="on"
                :disabled="!createdoc"
                @click="chooseDocuments()"
              >
                Оформить договор
              </v-btn>
            </template>
            <v-card>
              <v-form v-model="valid1">
                <v-card-title>
                  <span class="text-h5">Документы</span>
                </v-card-title>
                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="12" sm="6">
                        <v-select
                          v-model="passport_"
                          :items="passports"
                          label="Паспорт"
                          :rules="passport_license_Rules"
                          required
                        ></v-select>
                      </v-col>
                      <v-col cols="12" sm="6">
                        <v-select
                          v-model="license_"
                          :items="licensies"
                          label="Водительское удостоверение"
                          :rules="passport_license_Rules"
                          required
                        ></v-select>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="dialog2 = false">
                    Закрыть
                  </v-btn>
                  <v-btn
                    color="blue darken-1"
                    text
                    @click="showDoc()"
                    :disabled="!valid1"
                  >
                    Продолжить
                  </v-btn>
                </v-card-actions>
              </v-form>
            </v-card>
          </v-dialog>

          <v-dialog v-model="dialog3" width="1100px">
            <v-card>
              <div id="divtoprint">
                <v-card-title class="d-flex justify-center">
                  <h3>Договор автострахования {{ this.numberOfDoc }}</h3>
                  <h4>
                    на оказание услуг по добровольному комплексному страхованию
                    (КАСКО) транспортных средств
                  </h4>
                </v-card-title>
                <v-card-text>
                  <p>г. Москва</p>
                  <p>
                    {{ new Date(this.dateofdoc) | dateFormat("YYYY-MM-DD") }}
                  </p>
                  <p>
                    Настоящий Договор заключен в целях обеспечения нужд
                    автономного учреждения в порядке, предусмотренном
                    Гражданским кодексом Российской Федерации и иными
                    федеральными законами между {{ itemsCurrent.surname }}
                    {{ itemsCurrent.firstname }} {{ itemsCurrent.patronymic }},
                    именуемым в дальнейшем «Страхователь» с одной стороны, и
                    {{ agent.surname_ }} {{ agent.firstname_ }}, именуемым в
                    дальнейшем «Страховщик» с другой стороны.
                  </p>
                </v-card-text>
                <v-card-title class="d-flex justify-center">
                  <h5>Предмет договора</h5>
                </v-card-title>
                <v-card-text>
                  <p>
                    Страховщик обязуется оказать услуги по добровольному
                    комплексному страхованию (КАСКО) транспортных средств, в
                    порядке и в сроки, определяемые Сторонами в настоящем
                    Договоре, а Заказчик обязуется принять и оплатить оказанные
                    Услуги. Страховщик обязуется за обусловленную Договором
                    плату (страховую премию) при наступлении предусмотренного
                    Договором события (страхового случая) возместить
                    Страхователю причиненный вследствие этого события прямой
                    реальный ущерб (выплатить страховое возмещение), возникший в
                    связи с утратой (гибелью), недостачей или повреждением
                    транспортных средств, в пределах определенной Договором
                    страховой суммы в порядке и на условиях, предусмотренных
                    настоящим Договором. Страхователь обязан уплатить
                    Страховщику страховую премию в сроки и на условиях,
                    предусмотренных настоящим Договором. Услуги оказываются в
                    течение 365 дней с даты начала оказания Услуг (действия
                    полиса КАСКО).
                  </p>
                </v-card-text>
                <v-card-title class="d-flex justify-center">
                  <h5>Объект страхования</h5>
                </v-card-title>
                <v-card-text>
                  <p>
                    Объектом страхования по Договору являются не противоречащие
                    законодательству Российской Федерации имущественные интересы
                    Страхователя, связанные с владением, пользованием,
                    распоряжением транспортными средствами Страхователя.
                    Застрахованным транспортным средством является: VIN номер:
                    {{ this.itemsCurrent.vin }}, год выпуска:
                    {{ this.itemsCurrent.year }}, марка:
                    {{ this.itemsCurrent.name_ }}, модель:
                    {{ this.itemsCurrent.namemodel }},
                  </p>
                </v-card-text>
                <v-card-title class="d-flex justify-center">
                  <h5>Страховой случай</h5>
                </v-card-title>
                <v-card-text>
                  <p>
                    Страховым случаем по настоящему Договору является:
                    {{ this.radios == true ? "Только ущерб" : "Ущерб и угон" }}
                  </p>
                </v-card-text>
                <v-card-title class="d-flex justify-center">
                  <h5>Период страхования</h5>
                </v-card-title>
                <v-card-text>
                  <p>
                    Период страхования – отрезок времени, в течение которого
                    может произойти событие, которое будет рассматриваться
                    Страховщиком в качестве страхового случая. Период
                    страхования по настоящему Договору устанавливается равным 12
                    календарным месяцам.
                  </p>
                </v-card-text>
                <v-card-title class="d-flex justify-center">
                  <h5>Сумма полиса КАСКО</h5>
                </v-card-title>
                <v-card-text>
                  <p>
                    По настоящему договору сумма полиса КАСКО составляет:
                    {{ this.sumcasco }} ₽.
                  </p>
                </v-card-text>
                <v-card-title class="d-flex justify-center">
                  <h5>Права и обязанности сторон</h5>
                </v-card-title>
                <v-card-text>
                  <p>
                    Страхователь имеет право: Получать от Страховщика
                    разъяснения, акт о страховом случае.Требовать уплаты штрафа
                    в случаях, установленных настоящим Договором.Осуществлять
                    иные права, предусмотренные законодательством Российской
                    Федерации, настоящим Договором и Правилами.
                  </p>
                  <p>
                    Страхователь обязан: Уплатить Страховщику страховую премию в
                    сроки и в порядке, установленные в настоящем Договоре.
                    Предоставлять Страховщику всю информацию, изложение которой
                    требуется от Страхователя при оформлении полисов.Принимать
                    все зависящие от него меры для предотвращения наступления
                    страхового случая и сокращения возможных убытков в отношении
                    застрахованного имущества. В течение разумных сроков по
                    согласованию со Страховщиком, сохранять неизменными и
                    неисправленными все записи, документы, устройства или
                    предметы, которые каким-либо образом явились причиной
                    ущерба, нанесенного застрахованному имуществу.
                  </p>
                  <p>
                    Страховщик имеет право: Проверить предоставленную
                    Страхователем информацию и соответствие застрахованного
                    имущества предоставленному Страховщику описанию, а также
                    выполнению условий Договора. Требовать от Страхователя
                    документы, удостоверяющие наступление страхового случая, а
                    также подтверждающие размер подлежащего выплате страхового
                    возмещения. При необходимости направлять запрос в
                    компетентные органы о представлении соответствующих
                    документов и информации, подтверждающих факт и причину
                    наступления страхового события.Самостоятельно выяснять
                    причины и обстоятельства страхового случая. Проводить осмотр
                    или обследование поврежденного застрахованного имущества,
                    расследование в отношении причин и размера убытка.
                  </p>
                  <p>
                    Страховщик обязан: Ознакомить Страхователя с Правилами и
                    передать их ему до заключения настоящего Договора. Не
                    разглашать сведения о Страхователе и его имущественном
                    положении, если это не вступит в противоречие с
                    законодательными актами Российской Федерации. Направлять
                    Страхователю исчерпывающие, обоснованные ответы на его
                    письменные запросы в срок не позднее 5-ти дней с момента
                    получения соответствующего запроса от Страхователя.
                    Выполнять иные обязанности, предусмотренные настоящим
                    Договором и/или Правилами.
                  </p>
                </v-card-text>
                <v-card-text>
                  <p>Страховщик подпись:</p>
                  <p>Страхователь подпись:</p>
                </v-card-text>
              </div>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  color="green darken-1"
                  text
                  @click="
                    dialog3 = false;
                    dialog2 = false;
                  "
                >
                  Закрыть
                </v-btn>
                <v-btn
                  color="green darken-1"
                  text
                  @click="createPolicyAndDoc()"
                >
                  Создать
                </v-btn>
                <v-btn
                  color="green darken-1"
                  text
                  @click="printContent()"
                  :disabled="!policeCreated"
                >
                  Печать
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-dialog v-model="dialog4" width="500">
            <v-card>
              <v-card-title>
                <p>Договор и полис успешно созданы</p>
              </v-card-title>
            </v-card>
          </v-dialog>
        </v-row>
      </v-col>
    </v-row>
  </v-form>
</template>

<script>
import axios from "axios";

export default {
  components: {},
  data() {
    return {
      editedItem: {
        id: "",
        vin: "",
        name_: "",
        namemodel: "",
        surname: "",
        firstname: "",
        coef: "",
        coefmodel: "",
        year: "",
      },
      arrCars: null,
      itemsCurrent: {
        id: "",
        surname: "",
        firstname: "",
        patronymic: "",
        dateOfBirth: "",
        gender: "",
        registration: "",
        phone: "",
        email: "",
        id_customer_: "",
      },
      agent: {
        id: localStorage.id,
        surname_: localStorage.surname_,
        firstname_: localStorage.firstname_,
      },
      passport_: "",
      license_: "",
      radios: null,
      checkbox: false,
      sumFranc: "",
      sumcasco: "",
      valid: false,
      valid1: false,
      createdoc: false,
      createpolice: false,
      policeCreated: false,
      numberOfDoc: "",
      numberOfPolicy: "",
      dateofdoc: "",
      search: "",
      dialogDelete: false,
      selectedItemIndex: -1,
      headers: [
        { text: "ID", value: "id", align: "center", width: "70px" },
        { text: "VIN", value: "vin", align: "center" },
        { text: "Марка", value: "name_", align: "center" },
        { text: "Модель", value: "namemodel", align: "center" },
        { text: "Фамилия", value: "surname", align: "center" },
        { text: "Имя", value: "firstname", align: "center" },
      ],
      items_arr: [],
      selected: [],
      passport_arr: [],
      passports: [],
      license_arr: [],
      licensies: [],
      dialog: false,
      dialog2: false,
      dialog3: false,
      dialog4: false,
      sumRules: [
        (v) => !!v || "Поле обязательно для заполнения",
        (v) => v >= 1000 || "Должно быть больше 1000",
        (v) => v <= 20000 || "Должно быть меньше 20000",
      ],
      passport_license_Rules: [(v) => !!v || "Поле обязательно для заполнения"],
    };
  },
  computed: {},
  methods: {
    checkSelection() {
      this.createpolice = false;
      this.createdoc = false;
      this.policeCreated = false;
      this.sumcasco = 0;
      if (
        this.selected.length !== 0 &&
        (this.checkbox == false ||
          (this.checkbox == true &&
            this.sumFranc >= 1000 &&
            this.sumFranc <= 20000))
      ) {
        this.valid = true;
      } else this.valid = false;
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
    calcSum() {
      this.createdoc = true;
      this.sumcasco = Math.round(
        (5e6 * +this.selected[0].coef * +this.selected[0].coefmodel) /
          +this.selected[0].year
      );
      if (!this.radios) this.sumcasco = Math.round(1.5 * this.sumcasco);
      if (this.checkbox) this.sumcasco -= Math.round(this.sumFranc / 4);
      return this.sumcasco;
    },
    add1year(date) {
      var dateMs = date - 0;
      var days = 365;
      var msToAdd = days * 24 * 60 * 60 * 1000;
      var newDate = new Date(dateMs + msToAdd);
      return newDate;
    },
    printContent() {
      var DocumentContainer = document.getElementById("divtoprint");
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
    calcNumberOfPolicy() {
      axios
        .get(`http://localhost:8080/api/policy/`)
        .then((response) => {
          this.numberOfPolicy =
            response.data[response.data.length - 1].id + 1e9;
          console.log(this.numberOfPolicy);
        })
        .catch((error) => {
          console.log(error);
        });
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
    createPolicyAndDoc() {
      axios
        .get(`http://localhost:8080/api/doc/`)
        .then((response) => {
          this.numberOfDoc = response.data[response.data.length - 1].id + 1e9;
          console.log(this.numberOfDoc);
          axios({
            method: "post",
            url: "http://localhost:8080/api/doc/",
            data: {
              numerDoc: this.numberOfDoc,
              date_: this.dateofdoc,
              id_car: this.itemsCurrent.id,
              id_client: this.itemsCurrent.id_customer_,
              id_agent: this.agent.id,
            },
          })
            .then((response) => {
              console.log(response.data);
            })
            .catch((error) => {
              console.log(error);
            });
        })
        .catch((error) => {
          console.log(error);
        });

      axios({
        method: "post",
        url: "http://localhost:8080/api/policy/",
        data: {
          numerPolic: this.numberOfPolicy,
          dateStart_: this.dateofdoc,
          dateEnd_: this.add1year(this.dateofdoc),
          cost: this.sumcasco,
          onlyDamage: this.radios == 1 ? true : false,
          damageTheft: this.radios == 0 ? true : false,
          franchise: this.checkbox,
          sumFranchise: this.sumFranc == "" ? 0 : this.sumFranc,
          id_car_: this.itemsCurrent.id,
          id_client_: this.itemsCurrent.id_customer_,
        },
      })
        .then((response) => {
          console.log(response.data);
          this.dialog4 = true;
          this.policeCreated = true;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    chooseDocuments() {
      (this.passports = []),
        (this.licensies = []),
        axios
          .get(`http://localhost:8080/api/car/`)
          .then((response) => {
            this.arrCars = response.data;
            for (let i = 0; i < this.arrCars.length; i++) {
              if (this.arrCars[i].id == this.selected[0].id) {
                this.itemsCurrent = this.arrCars[i];
                break;
              }
            }
            axios
              .get(
                `http://localhost:8080/api/passport?id=${this.itemsCurrent.id_customer_}`
              )
              .then((response) => {
                this.passport_arr = response.data;
                response.data.forEach((item) => {
                  this.passports.push(`${item.series} ${item.number_}`);
                });
                console.log(this.passport_arr);
              });
            axios
              .get(
                `http://localhost:8080/api/drivelicense?id=${this.itemsCurrent.id_customer_}`
              )
              .then((response) => {
                this.license_arr = response.data;
                response.data.forEach((item) => {
                  this.licensies.push(item.number1);
                });
                console.log(this.license_arr);
              });
          })

          .catch((error) => console.log(error));
    },
    showDoc() {
      this.dialog3 = true;
      this.dateofdoc = new Date();
      console.log(this.dateofdoc);
      axios
        .get(`http://localhost:8080/api/doc/`)
        .then((response) => {
          this.numberOfDoc = response.data[response.data.length - 1].id + 1e9;
          console.log(this.numberOfDoc);
        })
        .catch((error) => console.log(error));
      axios
        .get(`http://localhost:8080/api/car/`)
        .then((response) => {
          this.arrCars = response.data;
          //console.log(this.arrCars);
          for (let i = 0; i < this.arrCars.length; i++) {
            if (this.arrCars[i].id == this.selected[0].id) {
              this.itemsCurrent = this.arrCars[i];
              break;
            }
          }
          //console.log(this.itemsCurrent);
        })
        .catch((error) => console.log(error));
      this.calcNumberOfPolicy();
    },
    createDocumentCasco() {},
  },
  watch: {
    selected() {
      //console.log(this.selected);
      this.checkSelection();
    },
  },
  mounted() {
    axios
      .get("http://localhost:8080/api/car/")
      .then((response) => {
        this.items_arr = response.data;
      })
      .catch((error) => console.log(error));
  },
  created() {
    if (localStorage.getItem("id") == "") {
      this.$router.push("/login");
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