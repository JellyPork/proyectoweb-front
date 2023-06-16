

// Components


// Composables
import { createApp } from 'vue'
import App from './App.vue'
import './index.css'
// Plugins
import { registerPlugins } from '@/plugins'
import store from './plugins/store';
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// : Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDTB8sdYqJ2cWZEKV4cMLfZJjDa1qobaPs",
  authDomain: "proyectoweb-e2f5b.firebaseapp.com",
  projectId: "proyectoweb-e2f5b",
  storageBucket: "proyectoweb-e2f5b.appspot.com",
  messagingSenderId: "1010478600931",
  appId: "1:1010478600931:web:1f0fa9bee368a2f0acabd6"
};

initializeApp(firebaseConfig);

const app = createApp(App)

registerPlugins(app)
app.use(store);
app.mount('#app')
