<script setup>
const router = useRouter()
const ingredients = ref([{ name: "" }])
const steps = ref("")
const name = ref("")
const addIngredient = () => {
    ingredients.value.push({ name: "" })
}
const userStore = useUserStore()
const { uid } = storeToRefs(userStore)

const recipesStore = useRecipesStore()
const { addRecipe } = recipesStore

const saveRecipe = async () => {
    const objToSend = {
        name: name.value,
        ingredients: ingredients.value,
        userId: uid.value,
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
        <ion-header style="background: var(--ion-color-light)">
            <ion-toolbar>
                <ion-title>Nowa lista zakupowa</ion-title>
            </ion-toolbar>
        </ion-header>
        <ion-content :fullscreen="true">
            <h2>Dodaj swój przpies</h2>
            <uiList>
                <uiInput
                    label="Nazwa przepisu"
                    v-model="name"
                    type="text"
                    placeholder="Nazwa Twojego przepisu..."
                />
                <uiInput
                    v-for="(ingredient, index) in ingredients"
                    :key="index"
                    :label="'Składnik ' + (index + 1)"
                    v-model="ingredients[index].name"
                    type="text"
                    placeholder="Twój składnik..."
                />
                <uiTextarea
                    label="Przepis"
                    placeholder="Podaj przepis"
                    v-model="steps"
                ></uiTextarea>
            </uiList>

            <div class="flex justify-between">
                <uiButton type="secondary" @click="addIngredient" class="my-6"
                    >Dodaj składnik</uiButton
                >
                <uiButton @click="saveRecipe" class="my-6"> Zapisz </uiButton>
            </div>
        </ion-content>
    </ion-page>
</template>
