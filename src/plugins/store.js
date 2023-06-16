import { createStore } from 'vuex';

const store = createStore({
  state() {
    return {
      isAuth: false, // Variable booleana para confirmar si se ha obtenido un token JWT
    };
  },
  mutations: {
    setIsAuth(state, value) {
      state.isAuth = value;
    },
  },
});

export default store;
