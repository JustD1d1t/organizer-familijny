<script setup>
import axios from "axios"
import { GlobalWorkerOptions } from "pdfjs-dist/legacy/build/pdf"
import { computed, ref } from "vue"
import { useRoute } from "vue-router"
import { StateEntries } from "@/types"

const { backendUrl } = useConfig()

GlobalWorkerOptions.workerSrc =
    "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.3.136/pdf.worker.min.mjs"

const route = useRoute()
const params = route.params
const shop = params.shop

const shops = useState(StateEntries.Shops, () => [])
const newspapers = useState(StateEntries.Newspapers, () => [])

const isLoading = ref(false)

const currentShop = computed(() => shops.value[shop])

const fetchNewspapers = async () => {
    try {
        isLoading.value = true
        const response = await axios.get(`${backendUrl}/html`, {
            params: {
                url: currentShop.value.url,
            },
        })
        return response.data.data
    } catch (error) {
        isLoading.value = false
        console.error("Error fetching shops:", error)
    }
}

const setNewspapers = async () => {
    newspapers.value = []
    const content = await fetchNewspapers()
    const el = document.createElement("html")
    el.innerHTML = content
    const titles = el.querySelectorAll(".newspapper-footer p")
    const downloadUrls = el.querySelectorAll(
        ".newspapper-nav-item.newspapper-nav-download"
    )
    titles.forEach((title, index) => {
        newspapers.value.push({
            title: title.textContent,
            url: downloadUrls[index].href,
        })
    })
    isLoading.value = false
}

const goToNewspaper = (index) => {
    navigateTo(`/newspaper/${shop}/${index}`)
}

onMounted(() => {
    setNewspapers()
})
</script>

<template>
    <ion-page>
        <ion-header>
            <ion-toolbar>
                <ion-buttons slot="start">
                    <ion-back-button
                        text=""
                        :icon="ioniconsArrowBackOutline"
                    ></ion-back-button>
                </ion-buttons>
                <ion-title>Gazetki</ion-title>
            </ion-toolbar>
        </ion-header>
        <ion-content>
            <div
                v-show="isLoading"
                class="w-full flex flex-col justify-center items-center h-full"
            >
                <ion-spinner name="lines-sharp"></ion-spinner>
                <span>ładowanie gazetek</span>
            </div>
            <div v-show="!isLoading">
                <ion-list>
                    <ion-item
                        v-for="(newspaper, index) in newspapers"
                        :key="newspaper.title"
                    >
                        <ion-label>{{ newspaper.title }}</ion-label>
                        <ion-button @click="goToNewspaper(index)" fill="clear">
                            Zobacz
                        </ion-button>
                    </ion-item>
                </ion-list>
            </div>
        </ion-content>
    </ion-page>
</template>
<style lang="scss" scoped>
ion-item.canvas {
    &::part(native) {
        padding-left: 0;
    }
}
</style>
