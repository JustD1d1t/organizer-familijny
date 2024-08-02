<script setup>
import { useRoute } from "vue-router"
import { StateEntries } from "@/types"

const { queryDocsInCollection, deleteDocument } = useFirebase()
const uid = useState(StateEntries.Uid)
const recipes = useState(StateEntries.Recipes, () => [])

const modal = ref()
const isLoading = ref(false)

const removeRecipe = async (recipeToRemove) => {
    await deleteDocument([StateEntries.Recipes, recipeToRemove.id])
    recipes.value = recipes.value.filter(
        (recipe) => recipe.id !== recipeToRemove.id
    )
}

const handleClick = (recipe) => {
    navigateTo(`/recipes/${recipe.id}`)
}

onMounted(async () => {
    recipes.value = await queryDocsInCollection([StateEntries.Recipes], false, [
        {
            key: "userId",
            value: uid.value,
            statement: "==",
        },
    ])
})

const goToAddRecipePage = () => {
    navigateTo("/recipes/new")
}
</script>
<template>
    <ion-page>
        <ion-header>
            <ion-toolbar class="ion-color-primary ion-color">
                <ion-title>Przepisy</ion-title>
            </ion-toolbar>
        </ion-header>

        <ion-content :fullscreen="true">
            <div
                v-if="isLoading"
                class="w-full flex justify-center items-center h-full"
            >
                <ion-spinner name="lines-sharp"></ion-spinner>
            </div>
            <h2 v-else-if="!recipes.length">Nie masz jeszcze przepisów</h2>
            <div
                class="w-full p-2 grid-cols-2 grid auto-rows-max overflow-auto text-center"
                v-else
            >
                <uiCard
                    v-for="recipe in recipes"
                    :key="recipe.name"
                    class="flex flex-col m-2"
                >
                    <div
                        class="py-8 cursor-pointer flex justify-center grow"
                        @click="() => handleClick(recipe)"
                    >
                        <p :size="'2xl'" :classes="'text-center'">
                            {{ recipe.name }}
                        </p>
                    </div>
                    <div class="flex">
                        <uiButton
                            @click="() => removeRecipe(recipe)"
                            :color="'danger'"
                            :size="'small'"
                            class="w-full"
                        >
                            Usuń
                        </uiButton>
                    </div>
                </uiCard>
            </div>

            <ion-fab slot="fixed" vertical="bottom" horizontal="end">
                <ion-fab-button @click="goToAddRecipePage">
                    <ion-icon :icon="ioniconsAdd"></ion-icon>
                </ion-fab-button>
            </ion-fab>
        </ion-content>
    </ion-page>
</template>
