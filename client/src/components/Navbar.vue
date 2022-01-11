<template>
  <div>
    <v-app-bar color="#6A76AB" dark>
      <v-container fill-height>
        <v-row justify="space-between">
          <v-col cols="11">
            <v-toolbar-title align="center"
              >Автострахование КАСКО</v-toolbar-title
            >
          </v-col>
          <v-col>
            <v-container fluid style="height: 300px">
              <v-row>
                <v-menu bottom min-width="200px" rounded>
                  <template v-slot:activator="{ on }">
                    <v-btn icon x-large v-on="on">
                      <v-avatar v-on:login="loginAgent($event)">
                        <v-icon dark> mdi-account-circle </v-icon>
                      </v-avatar>
                    </v-btn>
                  </template>
                  <v-card>
                    <v-list-item-content class="justify-center">
                      <div class="mx-auto text-center">
                        <v-avatar @click="firstname_">
                          <v-icon> mdi-account-circle </v-icon>
                        </v-avatar>
                        <h3>{{ surname_ }}</h3>
                        <h3>{{ firstname_ }}</h3>
                        <v-divider class="my-3"></v-divider>
                        <v-btn
                          depressed
                          rounded
                          text
                          to="/login"
                          @click="
                            surname_ = '';
                            firstname_ = '';
                            id = 0;
                          "
                        >
                          Выход
                        </v-btn>
                      </div>
                    </v-list-item-content>
                  </v-card>
                </v-menu>
              </v-row>
            </v-container>
          </v-col>
        </v-row>
      </v-container>
    </v-app-bar>

    <v-container>
      <v-tabs
        class="d-flex justify-center mb-6"
        v-if="!$route.meta.hideNavigation"
      >
        <v-tab v-if="this.firstname_!=='admin'" to="/clients">Клиенты</v-tab>
        <v-tab v-if="this.firstname_!=='admin'" to="/calc">Расчет стоимости</v-tab>
        <v-tab v-if="this.firstname_!=='admin'" to="/docs">Договоры</v-tab>
        <v-tab v-if="this.firstname_!=='admin'" to="/policies">Полисы</v-tab>
        <v-tab v-if="this.firstname_=='admin'" to="/agents">Учетные записи</v-tab>
        <v-tab v-if="this.firstname_=='admin'" to="/addData">Добавление данных</v-tab>
      </v-tabs>
    </v-container>
  </div>
</template>

<script>
export default {
  data: () => ({
    get firstname_() {
      return localStorage.getItem("firstname_") || "";
    },
    get surname_() {
      return localStorage.getItem("surname_") || "";
    },
    get id() {
      return localStorage.getItem("id") || 0;
    },
    set firstname_(value) {
      localStorage.setItem("firstname_", value);
    },
    set surname_(value) {
      localStorage.setItem("surname_", value);
    },
    set id(value) {
      localStorage.setItem("id", value);
    },
  }),
  components: {},
  methods: {},
  async created() {
    this.id = localStorage.id;
    this.firstname_ = localStorage.firstname_;
    this.surname_ = localStorage.surname_;
  },
  
};
</script>

<style lang="scss" scoped>
</style>