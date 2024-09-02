export default defineNuxtRouteMiddleware((to, from) => {
    const uid = localStorage.getItem("uid")
    const emailVerified = localStorage.getItem("emailVerified")

    // Jeśli uid jest niezdefiniowane lub puste, przekieruj do /login
    if (!uid || uid === "undefined") {
        if (to.path !== "/login") {
            console.log("Redirecting to /login")
            return navigateTo("/login")
        }
    } else {
        // Jeśli użytkownik jest zalogowany
        if (emailVerified === "false") {
            if (to.path !== "/verify-email") {
                console.log("Redirecting to /verify-email")
                return navigateTo("/verify-email")
            }
        } else {
            // Jeśli użytkownik jest zweryfikowany
            if (
                to.path === "/login" ||
                to.path === "/register" ||
                to.path === "/verify-email"
            ) {
                if (to.path !== "/") {
                    console.log("Redirecting to /")
                    return navigateTo("/")
                }
            }
        }
    }
})
