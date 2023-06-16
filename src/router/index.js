// Composables
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    component: () => import('@/layouts/default/Default.vue'),
    children: [
      {
        path: '',
        name: 'Home',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "home" */ '@/views/Home.vue'),
      },
      {
        path: 'dashboard',
        name: 'Dashboard',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "home" */ '@/components/Main.vue'),
      },
      {
        path: 'propiedades',
        name: 'Propiedades',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "home" */ '@/components/PropiedadesDash.vue'),
      },
      {
        path: 'propiedad',
        name: 'Propiedad',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "home" */ '@/components/newPropiedades.vue'),
      },
      {
        path: 'personas',
        name: 'Personas',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "home" */ '@/components/PersonasDash.vue'),
      },
      {
        path: 'persona',
        name: 'Persona',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "home" */ '@/components/newPersonas.vue'),
      },
      {
        path: 'arrendatarios',
        name: 'Arrendatarios',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "home" */ '@/components/ArrendatariosDash.vue'),
      },
      {
        path: 'arrendatario',
        name: 'Arrendatario',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "home" */ '@/components/Arrendatarios.vue'),
      },
      {
        path: 'propietarios',
        name: 'Propietarios',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "home" */ '@/components/PropietariosDash.vue'),
      },
      {
        path: 'propietario',
        name: 'Propietario',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "home" */ '@/components/Propietarios.vue'),
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})


// Guardia de navegación
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')

  if (to.name !== 'Home' && !token) {
    // Si la ruta no es la página de inicio y no hay token, redirigir a la página de inicio de sesión
    next({ name: 'Home' })
  } else {
    // Continuar con la navegación
    next()
  }
})
export default router
