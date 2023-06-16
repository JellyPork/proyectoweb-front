<template>
  <v-app-bar flat>
    <v-app-bar-title @click="redirectToDashboard">
      <router-link to="/dashboard" class="title-link">
        <v-icon icon="mdi-circle-slice-4" />
        Real Estate SIMGRU
      </router-link>
    </v-app-bar-title>
    <v-spacer></v-spacer>

    <v-btn v-if="isAuth" @click="signout">Sign Out</v-btn>
  </v-app-bar>
</template>

<script setup>
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { onMounted, computed } from "vue";

const router = useRouter();
const store = useStore();

const redirectToDashboard = () => {
  router.push("/dashboard");
};

const isAuth = computed(() => {
  return store.state.isAuth;
});

const signout = () => {
  localStorage.removeItem("token");
  store.commit("setIsAuth", false);
  router.push("/");
};

onMounted(() => {
  const token = localStorage.getItem("token");
  if (token) {
    store.commit("setIsAuth", true);
  } else {
    store.commit("setIsAuth", false);
  }
});
</script>

<style scoped>
.title-link {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: inherit;
  cursor: pointer;
}
</style>
