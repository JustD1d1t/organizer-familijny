export default defineNuxtRouteMiddleware((to, from) => {
    const uid = localStorage.getItem("uid")
    const emailVerified = localStorage.getItem("emailVerified")

    // Jeśli uid jest niezdefiniowane lub puste
    if (!uid || uid === "undefined") {
        // Pozwól przejść do /register
        if (to.path === "/register") {
            return // Brak potrzeby przekierowania
        }

        if (to.path === "/reset-password") {
            return // Brak potrzeby przekierowania
        }

        // Przekieruj do /login, jeśli użytkownik próbuje przejść gdzie indziej
        if (to.path !== "/login") {
            return navigateTo("/login")
        }
    } else {
        // Jeśli użytkownik jest zalogowany
        if (emailVerified === "false") {
            if (to.path !== "/verify-email") {
                return navigateTo("/verify-email")
            }
        } else {
            // Jeśli użytkownik jest zweryfikowany
            if (
                to.path === "/login" ||
                to.path === "/register" ||
                to.path === "/verify-email"
            ) {
                console.log(`redirecting to ${to.path}`)
            }
        }
    }
})
