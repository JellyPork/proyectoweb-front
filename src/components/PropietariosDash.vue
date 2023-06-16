<template>
  <v-container>
    <v-data-table :headers="headers" :items="propietarios" class="elevation-1">
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>My CRUD</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-dialog v-model="dialog" max-width="500px">
            <template v-slot:activator="{ props }">
              <v-btn
                color="primary"
                dark
                class="mb-2"
                @click="goToAddPropiedad"
              >
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
                        v-model="editedItem.personaId"
                        label="Persona ID"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItem.propiedadId"
                        label="Propiedad ID"
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
        title: "Persona ID",
        align: "start",
        sortable: false,
        key: "personaId",
      },
      { title: "Propiedad ID", key: "propiedadId" },
      { title: "Persona", key: "persona" },
      { title: "Propiedad", key: "propiedad" },
      { title: "Actions", key: "actions", sortable: false },
    ],
    propietarios: [],
    editedIndex: -1,
    editedItem: {
      personaId: 0,
      propiedadId: 0,
    },
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
    goToAddPropiedad() {
      this.$router.push("/propietario");
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

          // Recorrer las propiedades
          this.propietarios.forEach((propietario) => {
            // Buscar el arrendatario correspondiente por propiedadId

            const persona = this.personas.find(
              (persona) => persona.id === propietario.personaId
            );

            // Si se encuentra el propietario, asignar su personaId a la propiedad propietario
            if (propietario) {
              propietario.persona = persona.nombre;
            }
            //i++;
          });

          // Recorrer las propiedades
          this.propietarios.forEach((propietario) => {
            // Buscar el arrendatario correspondiente por propiedadId

            const propiedad = this.propiedades.find(
              (propiedad) => propiedad.id === propietario.propiedadId
            );

            // Si se encuentra el propietario, asignar su personaId a la propiedad propietario
            if (propietario) {
              propietario.propiedad = propiedad.cve_catastral;
            }
            //i++;
          });
        })
        .catch((error) => {
          console.error("Error fetching brands:", error);
        });
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
          console.log(this.personas);
        })
        .catch((error) => {
          console.error("Error fetching brands:", error);
        });
    },
    fetchPropiedades() {
      const token = localStorage.getItem("token");
      axios
        .get("http://localhost:3000/propiedades", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          this.propiedades = response.data;
          console.log(this.propiedades);
          this.fetchArrendatarios();
        })
        .catch((error) => {
          console.error("Error fetching brands:", error);
        });
    },
    initialize() {
      this.propietarios = [];
    },

    editItem(item) {
      this.editedIndex = this.propietarios.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedIndex = this.propietarios.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    deleteItemConfirm() {
      const personaId = this.propietarios[this.editedIndex].id;
      const token = localStorage.getItem("token");
      axios
        .delete(`http://localhost:3000/propietarios/${personaId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then(() => {
          // Remove the item from the propietarios array
          this.propietarios.splice(this.editedIndex, 1);
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
        const personaId = this.propietarios[this.editedIndex].id;
        const token = localStorage.getItem("token");
        axios
          .put(
            `http://localhost:3000/propietarios/${personaId}`,
            this.editedItem,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )
          .then((response) => {
            // Update the item in the propietarios array
            this.propietarios.splice(this.editedIndex, 1, response.data);
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
    this.fetchPersonas();
    this.fetchPropiedades();
    this.fetchPropietarios();
  },
};
</script>
