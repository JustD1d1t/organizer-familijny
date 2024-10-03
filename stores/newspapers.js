import { defineStore } from "pinia"
const { backendUrl } = useConfig()
import axios from "axios"
import { useUserStore } from "./user"

export const useNewspapersStore = defineStore({
    id: "newspapers-store",
    state: () => {
        return {
            shops: [],
            user: useUserStore(),
        }
    },
    actions: {
        async fetchShops() {
            try {
                const response = await axios.get(`${backendUrl}/html`, {
                    params: {
                        url: "https://www.gazetkipromocyjne.net/",
                    },
                    headers: {
                        Authorization: `Bearer ${this.user.idToken}`,
                        "Content-Type": "application/json", // Jeśli potrzebujesz innego typu zawartości
                    },
                })
                return response.data.data
            } catch (error) {
                console.error("Error fetching shops:", error)
            }
        },
        async setShops() {
            const content = await this.fetchShops()
            const el = document.createElement("html")
            el.innerHTML = content
            const shopItems = el.querySelectorAll(".entry-image")
            const shopItemsLength = shopItems.length
            shopItems.forEach((item, index) => {
                if (shopItemsLength === index + 1) {
                    return
                }
                const itemDetails = item.querySelector(".title")
                if (!itemDetails) return
                const url = itemDetails.href
                const title = itemDetails.textContent
                    .replace("promocyjna", "")
                    .replace("sieci", "")
                this.shops.push({
                    url,
                    title,
                })
            })
        },
    },
})
