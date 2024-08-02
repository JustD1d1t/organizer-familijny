<script setup>
import axios from "axios"
import { StateEntries } from "@/types"

const { backendUrl } = useConfig()

const shops = useState(StateEntries.Shops, () => [])

const isLoading = ref(false)
const searchValue = ref("")

const fetchShops = async () => {
    try {
        isLoading.value = true
        const response = await axios.get(`${backendUrl}/html`, {
            params: {
                url: "https://www.gazetkipromocyjne.net/",
            },
        })
        return response.data.data
    } catch (error) {
        isLoading.value = false
        console.error("Error fetching shops:", error)
    }
}

const setShops = async () => {
    const content = await fetchShops()
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
        shops.value.push({
            url,
            title,
        })
    })
    isLoading.value = false
}

const shopsToDisplay = computed(() => {
    return shops.value.filter((shop) =>
        shop.title.toLowerCase().includes(searchValue.value.toLowerCase())
    )
})

const goToShop = (title) => {
    const searchedIndex = shops.value.findIndex((shop) => shop.title === title)
    navigateTo(`/newspaper/${searchedIndex}`)
}

onMounted(() => {
    if (!shops.value.length) {
        setShops()
    }
})
</script>

<template>
    <ion-page>
        <ion-header>
            <ion-toolbar class="ion-color-primary ion-color">
                <ion-title>newspaper</ion-title>
            </ion-toolbar>
        </ion-header>
        <ion-content>
            <div
                v-show="isLoading"
                class="w-full flex flex-col justify-center items-center h-full"
            >
                <ion-spinner name="lines-sharp"></ion-spinner>
                <span>ładowanie sklepów</span>
            </div>
            <div v-show="!isLoading">
                <ion-list>
                    <ion-item class="mb-4">
                        <ion-input
                            data-test="shop-input"
                            label="Szukaj..."
                            label-placement="floating"
                            ref="shopInput"
                            class="shopInput"
                            type="text"
                            v-model="searchValue"
                        ></ion-input>
                    </ion-item>
                    <ion-item v-for="shop in shopsToDisplay" :key="shop.title">
                        <ion-label>{{ shop.title }}</ion-label>
                        <uiButton @click="goToShop(shop.title)"
                            >View</uiButton
                        >
                    </ion-item>
                </ion-list>
            </div>
        </ion-content>
    </ion-page>
</template>
