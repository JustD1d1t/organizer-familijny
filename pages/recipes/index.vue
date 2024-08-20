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
            <ion-toolbar>
                <ion-buttons slot="start">
                    <ion-back-button
                        text=""
                        :icon="ioniconsArrowBackOutline"
                    ></ion-back-button>
                </ion-buttons>
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
                class="w-full"
                v-else
            >
                <RecipesItem
                    v-for="recipe in recipes"
                    :key="recipe.id"
                    :recipe="recipe"
                />
            </div>

            <ion-fab slot="fixed" vertical="bottom" horizontal="end">
                <ion-fab-button @click="goToAddRecipePage">
                    <ion-icon :icon="ioniconsAdd"></ion-icon>
                </ion-fab-button>
            </ion-fab>
        </ion-content>
    </ion-page>
</template>
