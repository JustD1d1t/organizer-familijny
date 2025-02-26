<script setup>
import Tesseract from "tesseract.js"
const { popularStores } = usePopularStores()
const { shoppingItemsCategories } = useShoppingItemsCategories()
import { usePhotoGallery } from "../composables/usePhotoGallery"
const { photoFromCamera, selectPhotoFromData } = usePhotoGallery()
import { useExpensesStore } from "~/stores/expenses"
const expensesStore = useExpensesStore()
const { addExpenseToStore } = expensesStore
const userStore = useUserStore()
const { uid } = storeToRefs(userStore)

const { billCategories } = useBillCategories()

const router = useRouter()
const selectedCategory = ref("")

const newExpenseName = ref("")
const newExpenseValue = ref("")
const newExpenseDate = ref()
const newShopName = ref("")
const expenseMembers = ref([])
const document = ref(null)
const photoBase64 = ref(null)
const photoEdited = ref(false)
const billLoaded = ref(false)
const billLoading = ref(false)

const inputErrors = ref({
    newShopName: "",
    newExpenseName: "",
    newExpenseValue: "",
    newExpenseDate: "",
})

const editingItem = ref(null)

const isOpen = ref(false)
const isOpenAddModal = ref(false)

const newItem = ref({
    name: "",
    price: "",
    category: "",
})

const ocrResult = ref(null)
const productList = ref([])
const canvas = ref(null) // Reference to the canvas

let priceFromSumaPLN = null
let priceFromRazemPLN = null
let highestNumber = 0 // Initialize as 0

const handleImageUpload = async (event) => {
    billLoaded.value = false
    billLoading.value = true
    ocrResult.value = null
    priceFromSumaPLN = null
    priceFromRazemPLN = null
    highestNumber = 0
    newShopName.value = ""
    newExpenseValue.value = ""
    newExpenseDate.value = ""
    const file = event.target.files[0]
    if (!file) return

    const img = new Image()
    const reader = new FileReader()

    reader.onload = (e) => {
        img.src = e.target.result
    }

    img.onload = () => processImage(img)

    reader.readAsDataURL(file) // Read the image as data URL
}

const addPhoto = async () => {
    try {
        const { pb64, doc } = await photoFromCamera()
        photoBase64.value = pb64
        document.value = doc
        photoEdited.value = true
    } catch (error) {
        console.error("Error adding photo", error)
    }
}

const processImage = (img) => {
    const ctx = canvas.value.getContext("2d")
    canvas.value.width = img.width
    canvas.value.height = img.height
    ctx.drawImage(img, 0, 0)

    convertToGrayscale(ctx)
    performOCR()
}

const convertToGrayscale = (ctx) => {
    const imageData = ctx.getImageData(
        0,
        0,
        canvas.value.width,
        canvas.value.height
    )
    const data = imageData.data
    for (let i = 0; i < data.length; i += 4) {
        const avg = (data[i] + data[i + 1] + data[i + 2]) / 3
        data[i] = data[i + 1] = data[i + 2] = avg
    }
    ctx.putImageData(imageData, 0, 0)
}

const performOCR = () => {
    canvas.value.toBlob((blob) => {
        Tesseract.recognize(blob, "pol")
            .then(({ data: { text } }) => {
                ocrResult.value = text
                parseReceipt(text) // Parse the OCR result
            })
            .catch((error) => console.error("OCR processing error:", error))
    })
}

const getMatchingStore = (line) => {
    for (let store of popularStores) {
        const threshold = store.length * 0.5
        const storeLower = store.toLowerCase()
        const lineLower = line.toLowerCase()

        if (lineLower.includes(storeLower)) {
            const matchLength = storeLower
                .split("")
                .filter((char) => lineLower.includes(char)).length
            if (matchLength >= threshold) {
                return store
            }
        }
    }
    return null
}

const characterConfusions = {
    O: ["0"], // Cyfra zero
    0: ["O"], // Litera O
    I: ["1", "l"], // Cyfra jeden i litera l
    1: ["I", "l"], // Litera I i litera l
    l: ["I", "1"], // Litera I i cyfra 1
    o: ["0"], // Cyfra zero
    i: ["1", "l"], // Cyfra jeden i litera l
    5: ["S"], // Litera S
    S: ["5"], // Cyfra 5
    2: ["Z"], // Litera Z
    Z: ["2"], // Cyfra 2
    8: ["B"], // Litera B
    B: ["8"], // Cyfra 8
    7: ["T"], // Litera T
    T: ["7"], // Cyfra 7
    E: ["F"], // Litera F
    F: ["E"], // Litera E
    G: ["6"], // Cyfra 6
    6: ["G"], // Litera G
    C: ["G", "("], // Litera G, gdyż w niektórych fontach mogą być podobne
    D: ["O"], // Litera O
    P: ["R"], // Litera R
    R: ["P"], // Litera P
    Q: ["O"], // Litera O
    Y: ["V"], // Litera V
    V: ["Y"], // Litera Y
    X: ["K"], // Litera K
    K: ["X"], // Litera X
    W: ["V"], // Litera V
    V: ["W"], // Litera W
    N: ["M"], // Litera M
    M: ["N"], // Litera N
    U: ["V"], // Litera V
    V: ["U"], // Litera U
    a: ["q", "o"], // Litera q, o
    q: ["a", "o"], // Litera a, o
    s: ["5"], // Cyfra 5
    z: ["2"], // Cyfra 2
    b: ["8"], // Cyfra 8
    g: ["6"], // Cyfra 6
    h: ["n"], // Litera n
    n: ["h"], // Litera h
    "(": ["C"], // Litera C
}

const getConfusableCharacters = (char) => {
    return characterConfusions[char] || []
}

const isConfusable = (char1, char2) => {
    if (char1 === char2) return true
    const confusable1 = getConfusableCharacters(char1)
    const confusable2 = getConfusableCharacters(char2)
    return confusable1.includes(char2) || confusable2.includes(char1)
}

const parseReceipt = (text) => {
    const lines = text.split("\n")
    const products = []

    lines.forEach((line) => {
        if (!newShopName.value) {
            const store = getMatchingStore(line)
            newShopName.value = store
        }
        const highestPriceMatch = line.match(/\d{1,4},\d{2}/)
        const sumaPLN = line.match(/SUMA\sPLN/)
        const razemPLN = line.match(/RAZEM\sPLN/)
        const dateMatch = line.match(/\d{4}\s*-\s*\d{2}\s*-\s*\d{2}/)

        if (sumaPLN) updatePriceFromMatch(sumaPLN, "sumaPLN")
        if (razemPLN) updatePriceFromMatch(razemPLN, "razemPLN")

        if (dateMatch) {
            newExpenseDate.value = dateMatch[0].replaceAll(" ", "")
        }

        if (highestPriceMatch) {
            const price = parseFloat(highestPriceMatch[0].replace(",", "."))
            if (price > highestNumber) highestNumber = price
        }
    })

    newExpenseValue.value = determineHighestPrice()
    billLoaded.value = true
    billLoading.value = false
}

// Updates the price from SUMA PLN or RAZEM PLN match
const updatePriceFromMatch = (match, type) => {
    const priceMatch = match.input.match(/\d{1,4},\d{2}/)
    if (priceMatch) {
        const price = parseFloat(priceMatch[0].replace(",", "."))
        if (type === "sumaPLN") priceFromSumaPLN = price
        if (type === "razemPLN") priceFromRazemPLN = price
    }
}

// Determines the highest price from available data
const determineHighestPrice = () => {
    if (priceFromSumaPLN && priceFromSumaPLN === highestNumber)
        return priceFromSumaPLN
    if (priceFromRazemPLN && priceFromRazemPLN === highestNumber)
        return priceFromRazemPLN
    return highestNumber
}

const validateInputs = () => {
    inputErrors.value["shopName"] = ""
    inputErrors.value["newExpenseValue"] = ""
    inputErrors.value["newExpenseDate"] = ""
    inputErrors.value["selectedCategory"] = ""
    if (!newShopName.value) {
        inputErrors.value["shopName"] = "Nazwa sklepu jest wymagana"
    }
    if (!newExpenseValue.value) {
        inputErrors.value["newExpenseValue"] = "Kwota jest wymagana"
    }
    if (!newExpenseDate.value) {
        inputErrors.value["newExpenseDate"] = "Data jest wymagana"
    }
    // if (!selectedCategory.value) {
    //     inputErrors.value["selectedCategory"] = "Kategoria jest wymagana"
    // }
}

const addExpense = async () => {
    validateInputs()
    if (Object.values(inputErrors.value).some((error) => error)) return
    const newExpense = {
        name: newExpenseName.value.toLowerCase(),
        value: parseFloat(newExpenseValue.value),
        timestamp: new Date(newExpenseDate.value).getTime(),
        shop: newShopName.value.toLowerCase(),
        userId: uid.value,
        familyMembers: expenseMembers.value,
        items: productList.value,
        category: selectedCategory.value,
    }
    await addExpenseToStore(newExpense)
    router.back()
}

const handleMember = (members) => {
    expenseMembers.value = members
}

const setOpen = (open) => (isOpen.value = open)
const setAddOpen = (open) => (isOpenAddModal.value = open)

const addNewProduct = () => {
    productList.value.push({
        name: newItem.value.name,
        price: parseFloat(newItem.value.price),
        category: newItem.value.category,
    })
    setAddOpen(false)
    newItem.value = {
        name: "",
        price: "",
        category: "",
    }
}

onMounted(() => {
    const today = new Date()

    const day = String(today.getDate()).padStart(2, "0")
    const month = String(today.getMonth() + 1).padStart(2, "0") // Miesiące są indeksowane od 0
    const year = today.getFullYear()

    newExpenseDate.value = `${year}-${month}-${day}`
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
                <ion-buttons slot="end">
                    <ion-button :strong="true" @click="addExpense()"
                        >Dodaj</ion-button
                    >
                </ion-buttons>
            </ion-toolbar>
        </ion-header>
        <ion-content>
            <div class="inner-content">
                <ion-list lines="none">
                    <uiInput type="file" @change="handleImageUpload" />
                    <uiInput
                        label="Nazwa sklepu"
                        v-model="newShopName"
                        :error="inputErrors['shopName']"
                    />
                    <uiInput label="Nawa wydatku" v-model="newExpenseName" />
                    <uiInput
                        label="Całkowita kwota"
                        type="number"
                        :error="inputErrors['newExpenseValue']"
                        v-model="newExpenseValue"
                    />
                    <uiInput
                        label="Data"
                        type="date"
                        :error="inputErrors['newExpenseDate']"
                        v-model="newExpenseDate"
                    />
                    <ion-item>
                        <ion-select
                            label="Kategoria"
                            label-placement="stacked"
                            v-model="selectedCategory"
                        >
                            <ion-select-option
                                v-for="(category, index) in billCategories"
                                :key="index"
                                :value="category"
                                >{{ category }}</ion-select-option
                            >
                        </ion-select>
                    </ion-item>
                    <FamilyDropdownSelectMember @toggleMember="handleMember" />
                    <!-- <uiButton @click="addPhoto" type="secondary">
                            <span> Zrób zdjęcie</span>
                        </uiButton> -->
                    <div>
                        <canvas ref="canvas" style="display: none"></canvas>
                        <div
                            v-if="billLoading"
                            class="w-full mt-8 flex justify-center items-center h-full"
                        >
                            <ion-spinner name="lines-sharp"></ion-spinner>
                        </div>
                    </div>
                </ion-list>
            </div>
            <!-- <ion-modal :is-open="isOpen">
                <ion-header>
                    <ion-toolbar>
                        <ion-title>Edytuj produkt</ion-title>
                        <ion-buttons slot="end">
                            <ion-button @click="setOpen(false)"
                                >Close</ion-button
                            >
                        </ion-buttons>
                    </ion-toolbar>
                </ion-header>
                <ion-content class="ion-padding">
                    <uiList>
                        <uiInput
                            v-model="editingItem.name"
                            label="Nazwa produktu"
                        />
                        <uiInput
                            v-model="editingItem.price"
                            label="Cena produktu"
                        />
                        <ion-item>
                            <ion-select
                                label="Kategoria"
                                label-placement="stacked"
                                placeholder="--- Wybierz kategorię ---"
                                v-model="editingItem.category"
                            >
                                <ion-select-option
                                    v-for="(category, index) in billCategories"
                                    :key="index"
                                    :value="category"
                                >
                                    {{ category }}
                                </ion-select-option>
                            </ion-select>
                        </ion-item>
                    </uiList>
                </ion-content>
            </ion-modal>
            <ion-modal :is-open="isOpenAddModal">
                <ion-header>
                    <ion-toolbar>
                        <ion-buttons slot="start">
                            <ion-button @click="setOpen(false)"
                                >anuluj</ion-button
                            >
                        </ion-buttons>
                        <ion-title>Nowy produkt</ion-title>
                        <ion-buttons slot="end">
                            <ion-button @click="addNewProduct"
                                >Zapisz</ion-button
                            >
                        </ion-buttons>
                    </ion-toolbar>
                </ion-header>
                <ion-content class="ion-padding">
                    <uiList>
                        <uiInput
                            v-model="newItem.name"
                            label="Nazwa produktu"
                        />
                        <uiInput
                            v-model="newItem.price"
                            label="Cena produktu"
                        />
                        <ion-item>
                            <ion-select
                                label="Kategoria"
                                label-placement="stacked"
                                placeholder="--- Wybierz kategorię ---"
                                v-model="newItem.category"
                            >
                                <ion-select-option
                                    v-for="(category, index) in billCategories"
                                    :key="index"
                                    :value="category"
                                >
                                    {{ category }}
                                </ion-select-option>
                            </ion-select>
                        </ion-item>
                    </uiList>
                </ion-content>
            </ion-modal> -->
        </ion-content>
    </ion-page>
</template>

<style lang="scss" scoped>
ion-modal {
    --height: 400px;
}
</style>
