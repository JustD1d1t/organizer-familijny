<script setup>
import { useRoute } from "vue-router"
import { StateEntries } from "@/types"

const route = useRoute()

const recipesStore = useRecipesStore()
const { currentRecipe } = storeToRefs(recipesStore)
const modal = ref()

const cancel = () => modal.value.$el.dismiss(null, "cancel")
const confirmModal = () => modal.value.$el.dismiss(null, "confirm")

watch(route, async (newRoute, oldRoute) => {
    cancel()
})

const recipeLink = computed(() => {
    const domainPattern = /(https?:\/\/)?(www\.)?[\w\-]+\.(com|com\.pl|pl)/
    const match = currentRecipe.value.url.match(domainPattern)
    return match ? match[0] : null
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
                <ion-title>Przepisy</ion-title>
            </ion-toolbar>
        </ion-header>
        <ion-content>
            <h2>{{ currentRecipe.name }}</h2>
            <a :href="currentRecipe.url" class="flex items-center">
                <ion-icon
                    size="small"
                    :icon="ioniconsGlobeOutline"
                    class="mr-1"
                />
                {{ recipeLink }}
            </a>
            <h3>Składniki</h3>
            <RecipesIngredientsList :ingredients="currentRecipe.ingredients" />
            <h3 v-if="currentRecipe.steps">Przepis</h3>
            <p v-if="currentRecipe.steps">{{ currentRecipe.steps }}</p>
            <uiButton
                
                class="mt-8"
                id="open-recipe-to-shopping-list-modal"
            >
                Dodaj do listy zakupowej
            </uiButton>

            <ion-modal
                class="auto-height"
                ref="modal"
                trigger="open-recipe-to-shopping-list-modal"
            >
                <RecipesAddRecipeToShoppingListModal
                    :cancel="cancel"
                    :confirm-modal="confirmModal"
                    :recipe="currentRecipe"
                />
            </ion-modal>
        </ion-content>
    </ion-page>
</template>
