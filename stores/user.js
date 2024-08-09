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
            localStorage.setItem("nickname", data.nickname)
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
            this.setLoading(false)
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
    },
})
