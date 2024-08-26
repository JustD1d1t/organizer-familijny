export default defineNuxtRouteMiddleware((to, from) => {
    const uid = localStorage.getItem("uid")
    if (to.path !== "/login" && to.path !== "/register" && (!uid || uid === "undefined")) {
        return navigateTo("/login")
    } else if (to.path === "/login" && uid && uid !== "undefined") {
        return navigateTo("/")
    }
})
