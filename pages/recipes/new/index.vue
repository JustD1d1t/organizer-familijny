<script setup>
import axios from "axios"
const router = useRouter()
const userStore = useUserStore()
const { uid } = storeToRefs(userStore)

const { backendUrl } = useConfig()

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
        url: recipeLink.value,
    }
    await addRecipe(recipe)
    router.back()
}
const addOwnRecipe = () => {
    navigateTo("/recipes/new/own")
}
</script>
<template>
    <ion-page>
        <ion-header style="background: var(--ion-color-light)">
            <ion-toolbar>
                <ion-title>Nowy przepis</ion-title>
            </ion-toolbar>
        </ion-header>
        <ion-content :fullscreen="true">
            <uiList>
                <uiInput
                    label="Adres strony"
                    type="text"
                    v-model="recipeLink"
                ></uiInput>
            </uiList>
            <uiInfoCard class="mt-8">
                <p>Możesz dodawać przepisy ze stron:</p>
                <ul class="my-2">
                    <li>www.przepisy.pl</li>
                    <li>www.aniagotuje.pl</li>
                    <li>www.kwestiasmaku.com</li>
                    <li>www.kucnialidla.pl</li>
                    <li>www.poprostupycha.com.pl</li>
                    <li>www.aniastarmach.pl</li>
                    <li>www.doradcasmaku.pl</li>
                </ul>
            </uiInfoCard>

            <uiButton @click="add" class="mt-6 mb-3 w-full">
                Dodaj przepis ze strony
            </uiButton>
            <span class="text-center block">lub</span>
            <uiButton type="secondary" @click="addOwnRecipe" class="my-3 w-full">
                Zapisz swój własny przepis
            </uiButton>
        </ion-content>
    </ion-page>
</template>
