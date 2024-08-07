<script setup>
import axios from "axios"
import { StateEntries } from "@/types"
const router = useRouter()

const { backendUrl } = useConfig()

const uid = useState(StateEntries.Uid)

const recipesStore = useRecipesStore()
const { addRecipe } = recipesStore

const props = defineProps({
    cancel: {
        type: Function,
        default: () => {},
    },
    confirmModal: {
        type: Function,
        default: () => {},
    },
})

const input = ref()
const recipeLink = ref("")

const fetchContent = async (url) => {
    try {
        const response = await axios.get(`${backendUrl}/html`, {
            params: {
                url: url,
            },
        })
        return response.data.data
    } catch (error) {
        console.error("Error fetching content:", error)
    }
}

const add = async () => {
    const recipeResponse = await fetchContent(recipeLink.value)
    const el = document.createElement("html")
    el.innerHTML = recipeResponse
    let name
    let ingredients
    let ingredientsArray = []
    if (recipeLink.value.includes("przepisy.pl")) {
        name = el.querySelector(".title").textContent
        ingredients = el.querySelectorAll(".ingredients-list-content-item")
    } else if (recipeLink.value.includes("aniagotuje.pl")) {
        name = el.querySelector(".article-content h1").textContent
        ingredients = el.querySelectorAll(".recipe-ing-list li")
    } else if (recipeLink.value.includes("kwestiasmaku.com")) {
        name = el.querySelector("h1.przepis").textContent
        ingredients = el.querySelectorAll(".field-name-field-skladniki ul li")
    } else if (recipeLink.value.includes("kuchnialidla.pl")) {
        name = el.querySelector(".lead h1").textContent
        ingredients = el.querySelectorAll(".skladniki ul li")
    } else if (recipeLink.value.includes("poprostupycha.com.pl")) {
        name = el.querySelector("h1.entry-title").textContent
        ingredients = el.querySelectorAll(".ingredient")
    } else if (recipeLink.value.includes("aniastarmach.pl")) {
        name = el.querySelector("h1.recipe-name").textContent
        ingredients = el.querySelectorAll(".recipe-what-to-buy ul li")
    } else if (recipeLink.value.includes("doradcasmaku.pl")) {
        name = el.querySelector("h1.grid-in-title").textContent
        ingredients = el.querySelectorAll(".grid-in-ingredients tbody tr")
    }
    ingredients.forEach((ingredient) => {
        ingredientsArray.push({
            name: ingredient.textContent,
        })
    })

    const recipe = {
        name: name,
        ingredients: ingredientsArray,
        userId: uid.value,
    }
    await addRecipe(recipe)
    router.back()
}
</script>
<template>
    <ion-page>
        <ion-header>
            <ion-toolbar class="ion-color-primary ion-color">
                <ion-title>Nowa lista zakupowa</ion-title>
            </ion-toolbar>
        </ion-header>
        <ion-content :fullscreen="true">
            <ion-item>
                Możesz dodawać przepisy ze stron: www.przepisy.pl,
                www.aniagotuje.pl, www.kwestiasmaku.com, www.kuchnialidla.pl,
                www.poprostupycha.com.pl, www.aniastarmach.pl,
                www.doradcasmaku.pl
            </ion-item>
            <ion-item>
                <ion-input
                    label="Adres strony"
                    label-placement="floating"
                    ref="input"
                    type="text"
                    v-model="recipeLink"
                ></ion-input>
            </ion-item>

            <uiButton expand="block" @click="add" class="my-6"
                >Dodaj listę</uiButton
            >
        </ion-content>
    </ion-page>
</template>
