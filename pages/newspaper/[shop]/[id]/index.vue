<script setup>
import axios from "axios"
import { GlobalWorkerOptions, getDocument } from "pdfjs-dist/legacy/build/pdf"
import { computed, ref, toRaw } from "vue"
import { useRoute } from "vue-router"
import { StateEntries } from "@/types"

const { backendUrl } = useConfig()
const { request } = useFetchRequest()

const userStore = useUserStore()
const { idToken } = storeToRefs(userStore)

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
const loadedFullPdf = ref(false)

const currentNewspaper = computed(() => newspapers.value[id])

const fetchContent = async (imgs, pages) => {
    try {
        const objToSend = {
            imgs,
        }
        if (pages) {
            objToSend.pages = pages
        }
        waitingForRender.value = true
        isLoading.value = true
        const token = idToken.value
        const response = await axios.post(
            `${backendUrl}/html/pdfFromLinks`,
            objToSend, // Przekazanie tablicy obrazów jako body zapytania
            {
                responseType: "arraybuffer", // Odbieranie odpowiedzi jako PDF
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }
        )
        if (pages === undefined) {
            loadedFullPdf.value = true
        }

        return response.data
    } catch (error) {
        isLoading.value = false
        console.error("Error fetching content:", error)
        throw error
    }
}

const loadPdfFromUrl = async (pages) => {
    try {
        const pdfData = await fetchContent(currentNewspaper.value.imgs, pages)
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
        pageIndicator.value = `Strona ${pageNum} z ${loadedFullPdf.value ? totalPageCount.value : "..."}`
    } catch (error) {
        alert("Failed to render page: " + error.message)
    }
}

watch(route, async (newRoute, oldRoute) => {
    waitingForRender.value = false
})

onMounted(async () => {
    await loadPdfFromUrl(10)
    await loadPdfFromUrl()
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
                <uiList class="py-0 gap-0">
                    <ion-item class="text-center">
                        <h1 class="h2 w-full mt-0 mb-0">{{ currentNewspaper.title }}</h1>
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
                </uiList>
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
