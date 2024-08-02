<script setup>
import { useRoute } from "vue-router"
import { StateEntries } from "@/types"

const route = useRoute()

const recipes = useState(StateEntries.Recipes)

const modal = ref()

const recipe = computed(() => {
    const recipe = recipes.value.find((recipe) => recipe.id === route.params.id)
    return recipe
})
const ingredients = computed(() =>
    recipe.value ? recipe.value.ingredients : []
)
const name = computed(() => (recipe.value ? recipe.value.name : ""))

const cancel = () => modal.value.$el.dismiss(null, "cancel")
const confirmModal = () => modal.value.$el.dismiss(null, "confirm")

watch(route, async (newRoute, oldRoute) => {
    cancel()
})
</script>
<template>
    <ion-page>
        <ion-header>
            <ion-toolbar class="ion-color-primary ion-color">
                <ion-title>{{ name }}</ion-title>
            </ion-toolbar>
        </ion-header>
        <ion-content>
            <RecipesIngredientsList :ingredients="ingredients" />
            <uiButton
                expand="block"
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
                    :recipe="recipe"
                />
            </ion-modal>
        </ion-content>
    </ion-page>
</template>
