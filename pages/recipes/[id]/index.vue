<script setup>
import { useRoute } from "vue-router"
import { StateEntries } from "@/types"

const route = useRoute()

const recipesStore = useRecipesStore()
const { currentRecipe } = storeToRefs(recipesStore)
const modal = ref()

const ingredients = computed(() =>
    currentRecipe.value ? currentRecipe.value.ingredients : []
)
const name = computed(() =>
    currentRecipe.value ? currentRecipe.value.name : ""
)

const cancel = () => modal.value.$el.dismiss(null, "cancel")
const confirmModal = () => modal.value.$el.dismiss(null, "confirm")

watch(route, async (newRoute, oldRoute) => {
    cancel()
})
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
        <ion-content>
            <h2>{{ name }}</h2>
            <RecipesIngredientsList :ingredients="ingredients" />
            <ion-button
                expand="block"
                class="mt-8"
                id="open-recipe-to-shopping-list-modal"
            >
                Dodaj do listy zakupowej
            </ion-button>

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
