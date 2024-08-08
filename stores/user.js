import { defineStore } from "pinia"
const { backendUrl } = useConfig()
const { request } = useFetch()

export const useUserStore = defineStore({
    id: "user-store",
    state: () => {
        return {
            email: "",
            nickname: "",
            uid: "",
        }
    },
    actions: {
        setEmail(email) {
            this.email = email
        },
        setNickname(nickname) {
            this.nickname = nickname
        },
        async loginUser(email, password) {
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
            return data
        },
        async logoutUser() {
            console.log("logout")
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
        },
        async registerUser(email, password, nickname) {
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
            return data
        },
    },
})
