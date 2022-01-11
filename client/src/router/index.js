import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'
import Home from '../views/Home.vue'
import UserRegistration from '../views/UserRegistration.vue'
import AgentRegistration from '../views/AgentRegistration.vue'
import UserEdit from '../views/UserEdit.vue'
import AgentEdit from '../views/AgentEdit.vue'
import Clients from '../components/Clients.vue'
import Agents from '../components/Agents.vue'
import Calc from '../components/Calc.vue'
import Docs from '../components/Docs.vue'
import Policies from '../components/Policies.vue'
import AddData from '../components/AddData.vue'
import UserPassport from '../views/UserPassport.vue'
import PassportRegistration from '../views/PassportRegistration.vue'
import PassportEdit from '../views/PassportEdit.vue'
import LicenseEdit from '../views/LicenseEdit.vue'
import LicenseRegistration from '../views/LicenseRegistration.vue'
import UserLicense from '../views/UserLicense.vue'
import CarEdit from '../views/CarEdit.vue'
import CarRegistration from '../views/CarRegistration.vue'
import MarkRegistration from '../components/MarkRegistration.vue'
import ModelRegistration from '../components/ModelRegistration.vue'
import UserCar from '../views/UserCar.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: Home
  },
  {
    path: '/login',
    component: Login,
    meta: { hideNavigation: true }
  },
  {
    path: '/register-new-user/',
    component: UserRegistration
  },
  {
    path: '/edit-user/:id/',
    component: UserEdit
  },
  {
    path: '/passport/:id/',
    component: UserPassport
  },
  {
    path: '/register-new-passport/:id',
    component: PassportRegistration
  },
  {
    path: '/edit-passport/:id/:num/:idclient',
    component: PassportEdit
  },
  {
    path: '/license/:id/',
    component: UserLicense
  },
  {
    path: '/register-new-license/:id',
    component: LicenseRegistration
  },
  {
    path: '/edit-license/:id/:num/:idclient',
    component: LicenseEdit
  },
  {
    path: '/car/:id/',
    component: UserCar
  },
  {
    path: '/register-new-car/:id',
    component: CarRegistration
  },
  {
    path: '/edit-car/:id/:num/:idclient',
    component: CarEdit
  },
  {
    path: '/clients',
    component: Clients
  },
  {
    path: '/calc',
    component: Calc
  },
  {
    path: '/docs',
    component: Docs
  },
  {
    path: '/policies',
    component: Policies
  },
  {
    path: '/agents',
    component: Agents
  },  
  {
    path: '/register-new-agent/',
    component: AgentRegistration
  },
  {
    path: '/edit-agent/:id/',
    component: AgentEdit
  },
  
  {
    path: '/addData',
    component: AddData
  }, 
  
  {
    path: '/register-new-mark/',
    component: MarkRegistration
  },
  
  {
    path: '/register-new-model/',
    component: ModelRegistration
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
