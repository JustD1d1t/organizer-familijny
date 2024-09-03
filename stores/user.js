import { defineStore } from "pinia"
const { backendUrl } = useConfig()
const { request } = useFetchRequest()

export const useUserStore = defineStore({
    id: "user-store",
    state: () => {
        return {
            email: "",
            nickname: "",
            uid: "",
            emailVerified: false,
            idToken: "",
            isLoading: false,
        }
    },
    actions: {
        setEmail(email) {
            this.email = email
        },
        setNickname(nickname) {
            this.nickname = nickname
        },
        setLoading(isLoading) {
            this.isLoading = isLoading
        },
        setEmailVerified(emailVerified) {
            this.emailVerified = emailVerified
        },
        setIdToken(idToken) {
            this.idToken = idToken
        },
        async loginUser(email, password) {
            this.setLoading(true)
            const data = await request(`${backendUrl}/user/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    password,
                }),
                credentials: "include",
            })

            localStorage.setItem("uid", data.localId)
            localStorage.setItem("email", email)
            localStorage.setItem("nickname", data.displayName)
            localStorage.setItem("emailVerified", data.emailVerified)
            localStorage.setItem("idToken", data.idToken)
            this.setEmail(email)
            this.setNickname(data.displayName)
            this.setEmailVerified(data.emailVerified)
            this.setIdToken(data.idToken)
            this.setLoading(false)
            return data
        },
        async logoutUser() {
            this.setLoading(true)
            await request(`${backendUrl}/user/logout`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
            })
            localStorage.removeItem("uid")
            localStorage.removeItem("email")
            localStorage.removeItem("nickname")
            localStorage.removeItem("emailVerified")
            localStorage.removeItem("idToken")
            this.setEmail("")
            this.setNickname("")
            this.setEmailVerified(false)
            this.setIdToken("")
            this.setLoading(false)
        },
        async resendVerificationEmail() {
            this.setLoading(true)
            await request(`${backendUrl}/user/resend-verification-email`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    idToken: localStorage.getItem("idToken"),
                }),
                credentials: "include",
            })
            this.setLoading(false)
        },
        async checkEmailVerification() {
            this.setLoading(true)
            const data = await request(
                `${backendUrl}/user/check-email-verification`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        idToken: localStorage.getItem("idToken"),
                    }),
                    credentials: "include",
                }
            )
            this.setLoading(false)
            return data
        },
        async registerUser(email, password, nickname) {
            this.setLoading(true)
            const data = await request(`${backendUrl}/user/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    password,
                    nickname,
                }),
                credentials: "include",
            })
            this.setLoading(false)
            return data
        },
        async resetPassword(email) {
            this.setLoading(true)
            const data = await request(`${backendUrl}/user/send-reset-password`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                }),
                credentials: "include",
            })
            this.setLoading(false)
            return data
        },
    },
})
