import router from './router'

// GOOD
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  if (to.name !== 'Login' && !token) next({ name: 'Login' })
  else next()
})
