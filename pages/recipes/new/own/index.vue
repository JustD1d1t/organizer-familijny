<script setup>
const router = useRouter()
const ingredients = ref([{ name: "" }])
const steps = ref("")
const name = ref("")
const addIngredient = () => {
    ingredients.value.push({ name: "" })
}

const recipesStore = useRecipesStore()
const { addRecipe } = recipesStore

const saveRecipe = async () => {
    const objToSend = {
        name: name.value,
        ingredients: ingredients.value,
        userId: localStorage.getItem("uid"),
    }
    if (steps.value) {
        objToSend.steps = steps.value
    }

    await addRecipe(objToSend)
    router.back()
    router.back()
}
</script>
<template>
    <ion-page>
        <ion-header>
            <ion-toolbar>
                <ion-title>Nowa lista zakupowa</ion-title>
            </ion-toolbar>
        </ion-header>
        <ion-content :fullscreen="true">
            <h2>Dodaj swój przpies</h2>
            <ion-input
                label="Nazwa przepisu"
                v-model="name"
                type="text"
                placeholder="Nazwa Twojego przepisu..."
            />
            <ion-input
                v-for="(ingredient, index) in ingredients"
                :key="index"
                :label="'Składnik ' + (index + 1)"
                v-model="ingredients[index].name"
                type="text"
                placeholder="Twój składnik..."
            />
            <ion-textarea
                label="Przepis"
                placeholder="Podaj przepis"
                v-model="steps"
            ></ion-textarea>

            <ion-button expand="block" @click="addIngredient" class="my-6"
                >Dodaj składnik</ion-button
            >
            <ion-button expand="block" @click="saveRecipe" class="my-6">
                Zapisz
            </ion-button>
        </ion-content>
    </ion-page>
</template>
