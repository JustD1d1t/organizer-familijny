<script setup>
const recipesStore = useRecipesStore()
const { getRecipes, deleteRecipe, setCurrentRecipe } = recipesStore
const { recipes, isLoading } = storeToRefs(recipesStore)
const removeRecipe = async (recipeToRemove) => {
    await deleteRecipe(recipeToRemove.id)
}

const handleClick = (recipe) => {
    setCurrentRecipe(recipe)
    navigateTo(`/recipes/${recipe.id}`)
}

onMounted(async () => {
    await getRecipes()
})

const goToAddRecipePage = (recipe) => {
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
