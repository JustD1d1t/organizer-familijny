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

const recipeLink = computed(() => {
    if (props.recipe.url) {
        const domainPattern = /(https?:\/\/)?(www\.)?[\w\-]+\.(com|com\.pl|pl)/
        const match = props.recipe.url.match(domainPattern)
        return match ? match[0] : null
    }
    return ""
})
</script>
<template>
    <div
        class="flex flex-col py-2 pl-6 pr-2 bg-white rounded-2xl shadow-lg"
    >
        <div class="flex items-center">
            <div class="flex flex-col grow">
                <ion-label
                    class="flex-grow font-bold"
                    @click="() => handleClick(recipe)"
                    >{{ recipe.name }}</ion-label
                >
                <a
                    :href="recipe.url"
                    class="flex items-center"
                    v-if="recipeLink"
                >
                    <ion-icon
                        size="small"
                        :icon="ioniconsGlobeOutline"
                        class="mr-1"
                    />
                    {{ recipeLink }}
                </a>
            </div>
            <uiButton
                id="open-shopping-menu"
                class="ml-auto"
                @click="() => deleteRecipe(recipe.id)"
                type="tertiary"
            >
                <ion-icon size="medium" :icon="ioniconsTrashOutline" />
            </uiButton>
        </div>
    </div>
</template>
