<template>
    <div>
        <h1>OCR - Odczyt paragonu</h1>
        <input type="file" @change="handleImageUpload" />
        <canvas ref="canvas" style="display: none"></canvas>
        <!-- Ukryte płótno do przetwarzania obrazu -->

        <div v-if="ocrResult">
            <h2 v-if="storeName">Nazwa sklepu: {{ storeName }}</h2>
            <h3 v-if="date">Data zakupów: {{ date }}</h3>
            <h2>Rozpoznane produkty:</h2>
            <uiList>
                <ExpensesNewItem
                    v-for="(item, index) in productList"
                    :key="index"
                    :name="item.name"
                    :price="item.price"
                    :category="item.category"
                />
            </uiList>
            <!-- <ul>
                <li v-for="(item, index) in productList" :key="index">
                    {{ item.name }} - {{ item.price }} PLN - {{ item.category }}
                </li>
            </ul> -->
            <h2>Suma PLN: {{ highestPrice }}</h2>
        </div>
    </div>
</template>

<script setup>
import { ref } from "vue"
import Tesseract from "tesseract.js"

const { popularStores } = usePopularStores()
const { shoppingItemsCategories } = useShoppingItemsCategories()

const categoriesMap = computed(() => {
    const map = {}
    for (const [category, items] of Object.entries(shoppingItemsCategories)) {
        items.forEach((item) => {
            map[item] = category
        })
    }
    return map
})

// Refs for OCR and processing
const ocrResult = ref(null)
const productList = ref([])
const highestPrice = ref(0)
const canvas = ref(null) // Reference to the canvas
const storeName = ref(null)
const date = ref(null)

// Variables for storing price data
let priceFromSumaPLN = null
let priceFromRazemPLN = null
let highestNumber = 0 // Initialize as 0

// Handles image upload and processing
const handleImageUpload = async (event) => {
    ocrResult.value = null
    priceFromSumaPLN = null
    priceFromRazemPLN = null
    highestNumber = 0
    storeName.value = null
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

// Processes the image and performs OCR
const processImage = (img) => {
    const ctx = canvas.value.getContext("2d")
    canvas.value.width = img.width
    canvas.value.height = img.height
    ctx.drawImage(img, 0, 0)

    convertToGrayscale(ctx)
    performOCR()
}

// Converts the image to grayscale
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

// Performs OCR and parses the result
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
    C: ["G"], // Litera G, gdyż w niektórych fontach mogą być podobne
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

const findCategory = (name) => {
    const lowerName = name.toLowerCase() // Zamiana nazwy na małe litery
    let category = undefined

    const searchForCategory = (minLength) => {
        for (let key in categoriesMap.value) {
            const lowerKey = key.toLowerCase()

            for (let i = 0; i <= lowerKey.length - minLength; i++) {
                const substring = lowerKey.slice(i, i + minLength)
                let matchFound = false

                // Check for exact match
                if (lowerName.includes(substring)) {
                    matchFound = true
                } else {
                    // Check for confusable characters
                    for (let j = 0; j < substring.length; j++) {
                        const subChar = substring[j]
                        const lowerNameChars = lowerName.slice(i, i + minLength)

                        // Compare each character of the substring with corresponding character in lowerName
                        if (
                            lowerNameChars[j] &&
                            isConfusable(subChar, lowerNameChars[j])
                        ) {
                            matchFound = true
                        } else {
                            matchFound = false
                            break
                        }
                    }
                }

                if (matchFound) {
                    return categoriesMap.value[key]
                }
            }
        }
        return ""
    }

    // Najpierw spróbuj z długością 7 znaków
    category = searchForCategory(7)
    if (category) return category

    // Najpierw spróbuj z długością 6 znaków
    category = searchForCategory(6)
    if (category) return category

    // Jeśli nie znaleziono, spróbuj z długością 5 znaków
    category = searchForCategory(5)
    if (category) return category

    // Jeśli nadal nie znaleziono, spróbuj z długością 4 znaków
    category = searchForCategory(4)
    if (category) return category

    // Ostatecznie, jeśli nic nie znaleziono, zwróć undefined
    return ""
}

// Parses the receipt text and updates the product list and highest price
const parseReceipt = (text) => {
    const lines = text.split("\n")
    const products = []
    let totalPrice = 0

    lines.forEach((line) => {
        if (line.match(/gotówka/i)) return
        if (!storeName.value) {
            const store = getMatchingStore(line)
            storeName.value = store
        }

        const priceMatch = line.match(/-?\d{1,4},\d{2}[ABC]/)
        const highestPriceMatch = line.match(/\d{1,4},\d{2}/)
        const sumaPLN = line.match(/SUMA\sPLN/)
        const razemPLN = line.match(/RAZEM\sPLN/)
        const dateMatch = line.match(/\d{4}\s*-\s*\d{2}\s*-\s*\d{2}/)

        if (sumaPLN) updatePriceFromMatch(sumaPLN, "sumaPLN")
        if (razemPLN) updatePriceFromMatch(razemPLN, "razemPLN")

        if (dateMatch) {
            date.value = dateMatch[0].replaceAll(" ", "")
        }

        if (highestPriceMatch) {
            const price = parseFloat(highestPriceMatch[0].replace(",", "."))
            if (price > highestNumber) highestNumber = price
        }

        if (priceMatch) {
            const nameMatch = line.match(/^[^\d]+/)
            const cleanedPrice = parseFloat(
                priceMatch[0].replace(/[ABC]/, "").replace(",", ".")
            )
            totalPrice += cleanedPrice
            if (nameMatch) {
                const category = findCategory(nameMatch[0].trim())
                products.push({
                    name: nameMatch[0].trim(),
                    price: cleanedPrice,
                    category,
                })
            }
        }
    })

    highestPrice.value = determineHighestPrice()
    productList.value = products
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
</script>
