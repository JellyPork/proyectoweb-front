<template>
  <v-container>
    <v-card class="signupContainer">
      <v-card-title>Agregar Propietario</v-card-title>

      <v-card-text>
        <!-- Signup form fields -->

        <v-form ref="form" v-model="valid">
          <v-select
            v-model="formData.personaId"
            label="RFC"
            :items="rfcList"
            :item-value="getPersonaId"
          ></v-select>

          <v-select
            v-model="formData.propiedadId"
            label="Clave Catastral"
            :items="claveCatastralList"
            :item-value="getPropiedadId"
          ></v-select>
        </v-form>
      </v-card-text>

      <v-card-actions>
        <!-- Sign up button -->
        <v-btn @click="addPropietario" color="primary">Add propietario</v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

// Data properties
const formData = ref({
  persona_id: null, // Selected persona
  propiedad_id: null, // Selected propiedad
});

// Data properties
const personas = ref([]);
const propiedades = ref([]);
const rfcList = ref([]); // Array to store RFCs
const claveCatastralList = ref([]); // Array to store Claves Catastrales
const personasId = ref([]);
const propiedadesId = ref([]);

// Router instance
const router = useRouter();

// Fetch personas on component mount
onMounted(() => {
  fetchPersonas();
  fetchPropiedades();
});

// Fetch personas method
const fetchPersonas = () => {
  const token = localStorage.getItem("token");
  axios
    .get("http://localhost:3000/personas", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      personas.value = response.data;
      rfcList.value = response.data.map((persona) => persona.rfc);
      personasId.value = response.data.map((persona) => persona.id);
      // Set the default persona_id to the first persona in the list
    })
    .catch((error) => {
      console.error("Error fetching personas:", error);
    });
};

// Fetch propiedades method
const fetchPropiedades = () => {
  const token = localStorage.getItem("token");
  axios
    .get("http://localhost:3000/propiedades", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      // Set the default propiedad_id to the first propiedad in the list
      propiedades.value = response.data;

      // Update the Clave Catastral list
      claveCatastralList.value = response.data.map(
        (propiedad) => propiedad.cve_catastral
      );
      propiedadesId.value = response.data.map((propiedad) => propiedad.id);
    })
    .catch((error) => {
      console.error("Error fetching propiedades:", error);
    });
};

// propietario addition method
const addPropietario = () => {
  console.log(formData.value.persona_id);
  console.log(formData.value.propiedad_id);
  const token = localStorage.getItem("token");
  axios
    .post(
      "http://localhost:3000/propietarios/",
      {
        personaId: formData.value.personaId,
        propiedadId: formData.value.propiedadId,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
    .then((response) => {
      console.log(response.data);
      // Redirect or handle success
      router.push("/propietarios");
    })
    .catch((error) => {
      console.error("Error adding propietario:", error);
    });
};

const getPersonaId = (personaName) => {
  const index = rfcList.value.indexOf(personaName);

  if (index !== -1) {
    return personasId.value[index];
  }
  return null;
};

const getPropiedadId = (propiedadName) => {
  const index = claveCatastralList.value.indexOf(propiedadName);

  if (index !== -1) {
    return propiedadesId.value[index];
  }
  return null;
};
</script>

<style scoped>
.signupContainer {
  margin: 9vh auto;
  width: 50%;
}
</style>
