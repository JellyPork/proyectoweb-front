<template>
  <v-container class="fill-height">
    <v-row justify="center" align="center" class="fill-height">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card>
          <v-card-title class="text-center">
            <v-tabs v-model="tab" background-color="primary" dark>
              <v-tab :key="0">Login</v-tab>
              <v-tab :key="1">Signup</v-tab>
            </v-tabs>
          </v-card-title>

          <v-card-text>
            <v-form v-if="tab === 0">
              <v-text-field
                v-model="email"
                label="Email"
                required
              ></v-text-field>

              <v-text-field
                v-model="password"
                label="Password"
                type="password"
                required
              ></v-text-field>

              <v-row justify="center">
                <v-btn @click="login" color="primary">Login</v-btn>
                <v-btn @click="signInWithGoogle" color="red"
                  >Sign in with Google</v-btn
                >
              </v-row>
            </v-form>

            <v-form v-if="tab === 1">
              <v-text-field
                v-model="nombre"
                label="Name"
                required
              ></v-text-field>

              <v-text-field
                v-model="email"
                label="Email"
                required
              ></v-text-field>

              <v-text-field
                v-model="password"
                label="Password"
                type="password"
                required
              ></v-text-field>

              <v-row justify="center">
                <v-btn @click="signup" color="primary">Signup</v-btn>
                <v-btn @click="signInWithGoogle" color="red"
                  >Sign in with Google</v-btn
                >
              </v-row>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from "axios";

import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

export default {
  data() {
    return {
      tab: 1,
      nombre: "",
      email: "",
      password: "",
    };
  },
  methods: {
    signInWithGoogle() {
      const provider = new GoogleAuthProvider();
      signInWithPopup(getAuth(), provider)
        .then((result) => {
          const user = result.user;
          axios
            .post("http://localhost:3000/auth/google", { user })
            .then((response) => {
              const jwtToken = response.data.jwtToken;
            });
          localStorage.setItem("token", jwtToken);
          console.log(result.user.accessToken);
          this.$store.commit("setIsAuth", true);
          this.redirectToDashboard();
        })
        .catch((error) => {
          //handle error
        });
    },
    async login() {
      const { email, password } = this;
      try {
        const response = await axios.post(
          "http://www.localhost:3000/auth/login",
          {
            email,
            password,
          }
        );
        const token = response.data.token;
        // Almacena el token en el frontend (por ejemplo, en localStorage)
        localStorage.setItem("token", token);
        console.log("Login:", email, password, token);
        this.$store.commit("setIsAuth", true); // Actualiza el estado de autenticación en el store
        this.redirectToDashboard(); // Redirigir a la página de dashboard
      } catch (error) {
        console.error(error);
      }
    },
    async signup() {
      const { nombre, email, password } = this;
      try {
        const response = await axios.post(
          "http://www.localhost:3000/auth/signup",
          {
            nombre,
            email,
            password,
          }
        );
        const token = response.data.token;
        // Almacena el token en el frontend (por ejemplo, en localStorage)
        localStorage.setItem("token", token);
        console.log("Signup:", nombre, email, password, token);
        this.$store.commit("setIsAuth", true); // Actualiza el estado de autenticación en el store
        this.redirectToDashboard(); // Redirigir a la página de dashboard
      } catch (error) {
        console.error(error);
      }
    },
    redirectToDashboard() {
      const token = localStorage.getItem("token");
      if (token) {
        this.$router.push("/dashboard"); // Cambiar "/dashboard" por tu ruta de destino
      }
    },
  },
};
</script>

<style>
button {
  display: inline-block;
  line-height: 1;
  white-space: nowrap;
  cursor: pointer;
  background: #fff;
  border: 1px solid #dcdfe6;
  color: #606266;
  -webkit-appearance: none;
  text-align: center;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  outline: 0;
  margin: 0;
  -webkit-transition: 0.1s;
  transition: 0.1s;
  font-weight: 500;
  padding: 12px 20px;
  font-size: 14px;
  border-radius: 4px;
  margin-right: 1em;
}

button:disabled {
  background: #fff;
  color: #ddd;
  cursor: not-allowed;
}
</style>
