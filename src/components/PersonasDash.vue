<template>
  <v-container>
    <v-data-table :headers="headers" :items="personas" class="elevation-1">
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>My CRUD</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-dialog v-model="dialog" max-width="500px">
            <template v-slot:activator="{ props }">
              <v-btn color="primary" dark class="mb-2" @click="goToAddPerson">
                New Item
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="text-h5">{{ formTitle }}</span>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItem.rfc"
                        label="RFC"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItem.nombre"
                        label="Nombre"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue-darken-1" variant="text" @click="close">
                  Cancel
                </v-btn>
                <v-btn color="blue-darken-1" variant="text" @click="save">
                  Save
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-dialog v-model="dialogDelete" max-width="500px">
            <v-card>
              <v-card-title class="text-h5"
                >Are you sure you want to delete this item?</v-card-title
              >
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue-darken-1" variant="text" @click="closeDelete"
                  >Cancel</v-btn
                >
                <v-btn
                  color="blue-darken-1"
                  variant="text"
                  @click="deleteItemConfirm"
                  >OK</v-btn
                >
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-icon size="small" class="me-2" @click="editItem(item.raw)">
          mdi-pencil
        </v-icon>
        <v-icon size="small" @click="deleteItem(item.raw)"> mdi-delete </v-icon>
      </template>
      <template v-slot:no-data>
        <v-btn color="primary" @click="initialize"> Reset </v-btn>
      </template>
    </v-data-table></v-container
  >
</template>

<script>
import axios from "axios";

export default {
  data: () => ({
    dialog: false,
    dialogDelete: false,
    headers: [
      {
        title: "RFC",
        align: "start",
        sortable: false,
        key: "rfc",
      },
      { title: "Nombre", key: "nombre" },
      { title: "Propietario", key: "propietario" },
      { title: "Arrendatario", key: "arrendatario" },
      { title: "Actions", key: "actions", sortable: false },
    ],
    personas: [],
    propietarios: [],
    arrendatarios: [],
    editedIndex: -1,
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "New Item" : "Edit Item";
    },
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
  },

  created() {
    this.initialize();
  },

  methods: {
    goToAddPerson() {
      this.$router.push("/persona");
    },
    fetchPersonas() {
      const token = localStorage.getItem("token");
      axios
        .get("http://localhost:3000/personas", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          this.personas = response.data;
          var i = 0;
          // Recorrer las propiedades
          this.personas.forEach((persona) => {
            // Buscar el arrendatario correspondiente por propiedadId

            const arrendatario = this.arrendatarios.find(
              (arrendatario) => arrendatario.personaId === persona.id
            );

            // Si se encuentra el propietario, asignar su personaId a la propiedad propietario
            if (arrendatario) {
              persona.arrendatario = arrendatario.propiedades[i].propiedadId;
            }
            //i++;
          });
          var j = 0;
          // Recorrer las propiedades
          this.personas.forEach((persona) => {
            // Buscar el propietario correspondiente por propietarioId

            const propietario = this.propietarios.find(
              (propietario) => propietario.personaId === persona.id
            );

            // Si se encuentra el propietario, asignar su personaId a la propiedad propietario
            if (propietario) {
              persona.propietario = propietario.propiedad.cve_catastral;
            }
          });
        })
        .catch((error) => {
          console.error("Error fetching brands:", error);
        });
    },
    fetchPropietarios() {
      const token = localStorage.getItem("token");
      axios
        .get("http://localhost:3000/propietarios", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          this.propietarios = response.data;
          console.log(this.propietarios);
        })
        .catch((error) => {
          console.error("Error fetching brands:", error);
        });
    },
    fetchArrendatarios() {
      const token = localStorage.getItem("token");
      axios
        .get("http://localhost:3000/arrendatarios", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          this.arrendatarios = response.data;
          console.log(this.arrendatarios);
          this.fetchPersonas();
        })
        .catch((error) => {
          console.error("Error fetching brands:", error);
        });
    },
    initialize() {
      this.personas = [];
      this.propietarios = [];
      this.arrendatarios = [];
    },

    editItem(item) {
      this.editedIndex = this.personas.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedIndex = this.personas.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    deleteItemConfirm() {
      const personaId = this.personas[this.editedIndex].id;
      const token = localStorage.getItem("token");
      axios
        .delete(`http://localhost:3000/personas/${personaId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then(() => {
          // Remove the item from the personas array
          this.personas.splice(this.editedIndex, 1);
          this.closeDelete();
        })
        .catch((error) => {
          console.error("Error deleting persona:", error);
        });
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    save() {
      if (this.editedIndex > -1) {
        // Existing item, update with PUT request
        const personaId = this.personas[this.editedIndex].id;
        const token = localStorage.getItem("token");
        axios
          .put(`http://localhost:3000/personas/${personaId}`, this.editedItem, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((response) => {
            // Update the item in the personas array
            this.personas.splice(this.editedIndex, 1, response.data);
            this.close();
          })
          .catch((error) => {
            console.error("Error updating persona:", error);
          });
      } else {
        this.users.push(this.editedItem);
        this.close();
      }
    },
  },
  mounted() {
    this.fetchPropietarios();
    this.fetchArrendatarios();
  },
};
</script>
