<script setup>
import { useRoute } from "vue-router"
import { useShoppingListsStore } from "~/stores/shopping-lists"
const shoppingListsStore = useShoppingListsStore()
const { setCurrentRecipe, removeRecipe, handleRecipeChange } =
    shoppingListsStore

const route = useRoute()
const props = defineProps({
    recipe: {
        type: Object,
        default: () => {},
    },
    recipes: {
        type: Array,
        default: () => [],
    },
})

const allIngredientsChecked = computed(() => {
    return props.recipe.ingredients.every((ingredient) => ingredient.checked)
})

const goToRecipe = (id) => {
    navigateTo(`/shopping-lists/${route.params.id}/recipe/${id}`)
    setCurrentRecipe(props.recipe)
}
</script>
<template>
    <ion-item class="border-0">
        <ion-checkbox
            slot="start"
            class="mr-0"
            aria-label="Toggle task completion"
            @ionChange="
                (e) => handleRecipeChange(e.detail.checked, props.recipe)
            "
            :checked="allIngredientsChecked"
        ></ion-checkbox>
        <ion-label
            class="border-0 grow ml-4"
            @click="() => goToRecipe(recipe.id)"
            >{{ recipe.name }}</ion-label
        >
        <uiButton
            slot="end"
            @click="() => removeRecipe(props.recipe.id)"
            size="small"
            type="tertiary"
        >
            <ion-icon :icon="ioniconsTrash"></ion-icon>
        </uiButton>
    </ion-item>
</template>
