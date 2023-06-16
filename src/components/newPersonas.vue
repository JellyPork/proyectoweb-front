<template>
  <v-container>
    <v-card class="signupContainer">
      <v-card-title>Add User</v-card-title>

      <v-card-text>
        <!-- Signup form fields -->
        <v-form ref="form" v-model="valid">
          <v-text-field
            v-model.lazy="formData.rfc"
            :rules="nameRules"
            label="RFC"
          ></v-text-field>
          <v-text-field
            v-model.lazy="formData.nombre"
            :rules="nameRules"
            label="Name"
          ></v-text-field>
        </v-form>
      </v-card-text>

      <v-card-actions>
        <!-- Sign up button -->
        <v-btn @click="signUp" color="primary">Add User</v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

// Data property
const formData = ref({
  rfc: "",
  nombre: "",
});

// Router instance
const router = useRouter();

// Form validation rules
const nameRules = [(value) => !!value || "Name is required."];

const ageRules = [
  (value) => !!value || "Age is required.",
  // Add more age validation rules if needed
];

const emailRules = [
  (value) => !!value || "Email is required.",
  (value) => /.+@.+\..+/.test(value) || "Email must be valid.",
];

// Sign up method
const signUp = () => {
  // Send a POST request to the API endpoint
  const token = localStorage.getItem("token");
  axios
    .post(
      "http://localhost:3000/personas",
      {
        rfc: formData.value.rfc,
        nombre: formData.value.nombre,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
    .then((response) => {
      // Handle successful sign-up
      console.log(response.data);
      // Redirect to dashboard or another page after successful sign-up
      router.push("/personas");
    })
    .catch((error) => {
      // Handle sign-up error
      console.error(error.response.data);
    });
};
</script>
<style scoped>
.signupContainer {
  margin: 9vh auto;
  width: 50%;
}
</style>
