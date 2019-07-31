/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */

require('./bootstrap');

window.Vue = require('vue');

import { Form, HasError, AlertError } from 'vform'
Vue.component(HasError.name, HasError)
Vue.component(AlertError.name, AlertError)
window.Form = Form;

import VueRouter from 'vue-router'
Vue.use(VueRouter)

import moment from 'moment'

import VueProgressBar from 'vue-progressbar'
Vue.use(VueProgressBar, {
	color: '#bffaf3',
	failedColor: '#874b4b',
	thickness: '5px',
})

import swal from "sweetalert2"
window.swal = swal;
const toast = swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000
});
window.toast = toast;

window.Fire = new Vue();

Vue.component('pagination', require('laravel-vue-pagination'));

let routes = [
  { path: '/dashboard', component: require('./components/DashboardComponent').default },
  { path: '/crud', component: require('./components/CrudComponent').default }
]

const router = new VueRouter({
  routes,
  mode: 'history'
})

Vue.filter('capText', function(text) {
	return text.charAt(0).toUpperCase() + text.slice(1);
})

Vue.filter('viewDate', function(created) {
	return moment(created).format('DD-MMMM-Y');
})

/**
 * Next, we will create a fresh Vue application instance and attach it to
 * the page. Then, you may begin adding components to this application
 * or customize the JavaScript scaffolding to fit your unique needs.
 */

const app = new Vue({
    el: '#app',
    router
});
