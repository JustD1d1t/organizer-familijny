import { getAuth, onAuthStateChanged } from "firebase/auth"
export default defineNuxtRouteMiddleware((to, from) => {
    const auth = getAuth()
    onAuthStateChanged(auth, (user) => {
        if (user) {
            return navigateTo("/")
            // if (user.emailVerified) {
            //   return navigateTo("/");
            // } else {
            //   return navigateTo("/verify-email");
            // }
        } else {
            return navigateTo("/login")
        }
    })
})
