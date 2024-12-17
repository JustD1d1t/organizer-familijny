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
        <ion-header style="background: var(--ion-color-light)">
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
            <div v-else-if="!recipes.length">
                <uiInfoCard
                    title="Czy wiesz, że..."
                    subtitle="Możesz dodawać przepisy ze stron:"
                    icon="ioniconsBulb"
                    class="mt-8"
                >
                    <ul class="my-2">
                        <li>www.przepisy.pl</li>
                        <li>www.aniagotuje.pl</li>
                        <li>www.kwestiasmaku.com</li>
                        <li>www.kucnialidla.pl</li>
                        <li>www.poprostupycha.com.pl</li>
                        <li>www.aniastarmach.pl</li>
                        <li>www.doradcasmaku.pl</li>
                    </ul>
                    <p>Zawsze możesz zapisać również swój własny przepis</p>
                </uiInfoCard>
            </div>
            <div class="w-full h-full" v-else>
                <ion-accordion-group>
                    <ion-accordion value="first">
                        <ion-item slot="header" color="light">
                            <ion-label><b>Czy wiesz, że...</b></ion-label>
                        </ion-item>
                        <div class="ion-padding" slot="content">
                            <uiInfoCard
                                subtitle="Możesz dodawać przepisy ze stron:"
                                icon="ioniconsBulb"
                                class="mb-4 mt-2"
                            >
                                <ul class="my-2">
                                    <li>www.przepisy.pl</li>
                                    <li>www.aniagotuje.pl</li>
                                    <li>www.kwestiasmaku.com</li>
                                    <li>www.kucnialidla.pl</li>
                                    <li>www.poprostupycha.com.pl</li>
                                    <li>www.aniastarmach.pl</li>
                                    <li>www.doradcasmaku.pl</li>
                                </ul>
                                <p>
                                    Zawsze możesz zapisać również swój własny
                                    przepis
                                </p>
                            </uiInfoCard>
                        </div>
                    </ion-accordion>
                </ion-accordion-group>
                <uiList class="h-[70%]">
                    <RecipesItem
                        v-for="recipe in recipes"
                        :key="recipe.id"
                        :recipe="recipe"
                    />
                </uiList>
            </div>

            <ion-fab slot="fixed" vertical="bottom" horizontal="end">
                <ion-fab-button @click="goToAddRecipePage">
                    <ion-icon :icon="ioniconsAdd"></ion-icon>
                </ion-fab-button>
            </ion-fab>
        </ion-content>
    </ion-page>
</template>
