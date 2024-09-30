<script setup>
import axios from "axios"
import { GlobalWorkerOptions, getDocument } from "pdfjs-dist/legacy/build/pdf"
import { computed, ref, toRaw } from "vue"
import { useRoute } from "vue-router"
import { StateEntries } from "@/types"

const { backendUrl } = useConfig()
const { request } = useFetchRequest()

GlobalWorkerOptions.workerSrc =
    "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.3.136/pdf.worker.min.mjs"

const route = useRoute()
const params = route.params
const id = params.id

const newspapers = useState(StateEntries.Newspapers, () => [])

const curScale = ref(1.0)
const currentPage = ref(1)
const totalPageCount = ref(0)
const pageIndicator = ref("")
const pagesContainer = ref(null)
const pdf = ref(null)
const isLoading = ref(false)
const waitingForRender = ref(false)

const currentNewspaper = computed(() => newspapers.value[id])

const fetchContent = async (url) => {
    try {
        waitingForRender.value = true
        isLoading.value = true
        const token = localStorage.getItem("idToken")
        const response = await axios.get(`${backendUrl}/html/pdf`, {
            params: { url: url },
            responseType: "arraybuffer",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json", // Jeśli potrzebujesz innego typu zawartości
            },
        })
        return response.data
    } catch (error) {
        isLoading.value = false
        console.error("Error fetching content:", error)
        throw error
    }
}

const loadPdfFromUrl = async () => {
    try {
        const pdfData = await fetchContent(currentNewspaper.value.url)
        const pdfUint8Array = new Uint8Array(pdfData)
        const loadingTask = getDocument({ data: pdfUint8Array })

        loadingTask.promise
            .then((loadedPdf) => {
                pdf.value = loadedPdf
                totalPageCount.value = pdf.value.numPages
                renderPage(currentPage.value)
            })
            .catch((error) => {
                alert("Failed to load PDF: " + error.message)
            })
    } catch (error) {
        alert("Failed to load PDF: " + error.message)
    }
}

const prevPage = () => {
    if (currentPage.value > 1) {
        currentPage.value--
        renderPage(currentPage.value)
    }
}

const nextPage = () => {
    if (currentPage.value < totalPageCount.value) {
        currentPage.value++
        renderPage(currentPage.value)
    }
}

const renderPage = async (pageNum) => {
    if (!pdf.value || !waitingForRender.value) {
        return
    }
    try {
        const page = await toRaw(pdf.value).getPage(pageNum)
        const viewport = page.getViewport({ scale: curScale.value })

        const canvas = document.createElement("canvas")
        const context = canvas.getContext("2d")
        canvas.width = viewport.width
        canvas.height = viewport.height

        const renderContext = {
            canvasContext: context,
            viewport: viewport,
        }
        await page.render(renderContext).promise
        canvas.style.width = "100%"

        // Clear previous content and append the new canvas
        pagesContainer.value.innerHTML = ""
        pagesContainer.value.appendChild(canvas)
        isLoading.value = false

        // Update page indicator
        pageIndicator.value = `Strona ${pageNum} z ${totalPageCount.value}`
    } catch (error) {
        alert("Failed to render page: " + error.message)
    }
}

watch(route, async (newRoute, oldRoute) => {
    waitingForRender.value = false
})

onMounted(() => {
    loadPdfFromUrl()
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
                <span>ładowanie gazetki</span>
            </div>
            <div v-show="!isLoading">
                <ion-list lines="none">
                    <ion-item>
                        <h1 class="text-base">{{ currentNewspaper.title }}</h1>
                    </ion-item>
                    <ion-item class="canvas">
                        <div ref="pagesContainer" class="w-[100%]" />
                    </ion-item>
                    <ion-item>
                        <div class="w-[100%] flex justify-between items-center">
                            <uiButton type="tertiary" @click="prevPage">
                                Poprzednia
                            </uiButton>
                            <span>{{ pageIndicator }}</span>
                            <uiButton type="tertiary" @click="nextPage"
                                >Następna</uiButton
                            >
                        </div>
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
