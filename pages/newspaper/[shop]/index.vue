<script setup>
import axios from "axios"
import { GlobalWorkerOptions } from "pdfjs-dist/legacy/build/pdf"
import { computed, ref } from "vue"
import { useRoute } from "vue-router"
import { StateEntries } from "@/types"

const { backendUrl } = useConfig()

const newspapersStore = useNewspapersStore()
const { shops } = storeToRefs(newspapersStore)

const userStore = useUserStore()
const { idToken } = storeToRefs(userStore)

GlobalWorkerOptions.workerSrc =
    "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.3.136/pdf.worker.min.mjs"

const route = useRoute()
const params = route.params
const shop = params.shop

const newspapers = useState(StateEntries.Newspapers, () => [])

const isLoading = ref(false)

const currentShop = computed(() => shops.value[shop])

const fetchNewspapers = async () => {
    try {
        const token = idToken.value
        isLoading.value = true
        const response = await axios.get(`${backendUrl}/html`, {
            params: {
                url: currentShop.value.url,
            },
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json", // Jeśli potrzebujesz innego typu zawartości
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
    const buttons = el.querySelectorAll(".newspapper-footer button")
    const ids = Array.from(buttons).map((button) =>
        button.getAttribute("rel").replace("#", "")
    )
    const idDivs = ids.map((id) => el.querySelector(`#${id}`))
    const iframes = idDivs.map((idDiv) => idDiv.querySelector("iframe"))

    const token = idToken.value
    const images = []
    for (const iframe of iframes) {
        if (iframe) {
            const res = await axios.get(`${backendUrl}/html/imgs`, {
                params: {
                    url: iframe.dataset.src,
                },
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            })
            images.push(res.data.imgs)
        }
    }
    const downloadUrls = el.querySelectorAll(
        ".newspapper-nav-item.newspapper-nav-download"
    )
    titles.forEach((title, index) => {
        newspapers.value.push({
            title: title.textContent,
            imgs: images[index],
        })
    })
    isLoading.value = false
}

const goToNewspaper = (index) => {
    navigateTo(`/newspaper/${shop}/${index}`)
}

onMounted(async () => {
    setNewspapers()
})
</script>

<template>
    <ion-page>
        <ion-header style="background: var(--ion-color-light)">
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
                <div class="flex flex-wrap gap-1 items-between justify-between">
                    <div
                        v-for="(newspaper, index) in newspapers"
                        :key="newspaper.title"
                        class="w-[49%] flex flex-col mb-2"
                    >
                        <div class="flex items-center h-[320px]">
                            <img
                                :src="
                                    'https://www.gazetkipromocyjne.net' +
                                    newspaper.imgs[0]
                                "
                                class="w-full h-full"
                            />
                        </div>
                        <ion-label class="text-center">
                            <small>{{ newspaper.title }}</small>
                        </ion-label>
                        <uiButton type="tertiary" @click="goToNewspaper(index)">
                            Zobacz
                        </uiButton>
                    </div>
                </div>
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
