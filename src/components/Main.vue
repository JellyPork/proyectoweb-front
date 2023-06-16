<template>
  <v-container>
    <v-row>
      <v-col cols="6">
        <v-card @click="goToPropiedades">
          <v-card-title>
            <v-icon color="primary">mdi-home</v-icon>
            <span class="ml-2">Propiedades</span>
          </v-card-title>
          <v-card-actions>
            <v-btn>Click me</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
      <v-col cols="6">
        <v-card @click="goToPersonas">
          <v-card-title>
            <v-icon color="primary">mdi-account</v-icon>
            <span class="ml-2">Personas</span>
          </v-card-title>
          <v-card-actions>
            <v-btn>Click me</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="6">
        <v-card @click="goToArrendatarios">
          <v-card-title>
            <v-icon color="primary">mdi-heart</v-icon>
            <span class="ml-2">Generar Arrendatario</span>
          </v-card-title>
          <v-card-actions>
            <v-btn>Click me</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
      <v-col cols="6">
        <v-card @click="goToPropietarios">
          <v-card-title>
            <v-icon color="primary">mdi-book</v-icon>
            <span class="ml-2">Generar Propietarios</span>
          </v-card-title>
          <v-card-actions>
            <v-btn>Click me</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { useRouter } from "vue-router";

const router = useRouter();

const goToPropiedades = () => {
  router.push("/propiedades");
};

const goToPersonas = () => {
  router.push("/personas");
};

const goToPropietarios = () => {
  router.push("/propietarios");
};

const goToArrendatarios = () => {
  router.push("/arrendatarios");
};
</script>
