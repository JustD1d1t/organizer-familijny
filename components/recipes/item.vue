<script setup>
const props = defineProps({
    recipe: {
        type: Object,
        default: () => {},
    },
})

const recipesStore = useRecipesStore()
const { deleteRecipe, setCurrentRecipe } = recipesStore

const handleClick = (recipe) => {
    navigateTo(`/recipes/${recipe.id}`)
    setCurrentRecipe(recipe)
}
</script>
<template>
    <div
        class="flex flex-col py-2 pl-6 pr-2 my-1 bg-white rounded-2xl shadow-2xl"
    >
        <div class="flex items-center">
            <div class="flex flex-col grow">
                <ion-label
                    class="flex-grow font-bold"
                    @click="() => handleClick(recipe)"
                    >{{ recipe.name }}</ion-label
                >
            </div>
            <ion-button
                fill="clear"
                id="open-shopping-menu"
                class="ml-auto"
                size="small"
                @click="() => deleteRecipe(recipe.id)"
            >
                <ion-icon size="medium" :icon="ioniconsTrashOutline" />
            </ion-button>
        </div>
    </div>
</template>
