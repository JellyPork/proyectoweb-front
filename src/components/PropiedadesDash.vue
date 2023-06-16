<template>
  <v-container>
    <v-data-table :headers="headers" :items="propiedades" class="elevation-1">
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
                        v-model="editedItem.cve"
                        label="Clave Catastral"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItem.desc"
                        label="Descripcion"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItem.dir"
                        label="Direccion"
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
        title: "Clave Catastral",
        align: "start",
        sortable: false,
        key: "cve_catastral",
      },
      { title: "Descripcion", key: "descripcion" },
      { title: "Direccion", key: "direccion" },
      { title: "Propietario", key: "propietario" },
      { title: "Arrendatario", key: "arrendatario" },
      { title: "Actions", key: "actions", sortable: false },
    ],
    propiedades: [],
    propietarios: [],
    arrendatarios: [],
    editedIndex: -1,
    editedItem: {
      cve: "",
      desc: "",
      dir: "",
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
      this.$router.push("/propiedad");
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

          // Recorrer las propiedades
          this.propiedades.forEach((propiedad) => {
            // Buscar el propietario correspondiente por propietarioId

            const propietario = this.propietarios.find(
              (propietario) => propietario.propiedadId === propiedad.id
            );

            // Si se encuentra el propietario, asignar su personaId a la propiedad propietario
            if (propietario) {
              propiedad.propietario = propietario.persona.nombre;
            }
          });

          // Recorrer las propiedades
          this.propiedades.forEach((propiedad) => {
            // Buscar el arrendatario correspondiente por propiedadId

            const arrendatario = this.arrendatarios.find(
              (arrendatario) => arrendatario.propiedadId === propiedad.id
            );

            // Si se encuentra el propietario, asignar su personaId a la propiedad propietario
            if (arrendatario) {
              propiedad.arrendatario = arrendatario.persona.nombre;
            }
          });

          console.log(this.propiedades);
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
        })
        .catch((error) => {
          console.error("Error fetching brands:", error);
        });
    },
    initialize() {
      this.propiedades = [];
      this.propietarios = [];
    },

    editItem(item) {
      this.editedIndex = this.propiedades.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedIndex = this.propiedades.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    deleteItemConfirm() {
      const personaId = this.propiedades[this.editedIndex].id;
      const token = localStorage.getItem("token");
      axios
        .delete(`http://localhost:3000/propiedades/${personaId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then(() => {
          // Remove the item from the propiedades array
          this.propiedades.splice(this.editedIndex, 1);
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
        const personaId = this.propiedades[this.editedIndex].id;
        const token = localStorage.getItem("token");
        axios
          .put(
            `http://localhost:3000/propiedades/${personaId}`,
            this.editedItem,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )
          .then((response) => {
            // Update the item in the propiedades array
            this.propiedades.splice(this.editedIndex, 1, response.data);
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
    this.fetchPropiedades();
  },
};
</script>
