<script setup>
const shoppingListsStore = useShoppingListsStore()

const props = defineProps({
    nameDir: {
        type: String,
        default: "",
    },
    dir: {
        type: String,
        default: "",
    },
    lastSort: {
        type: String,
        default: "",
    },
})

const { currentShoppingList } = storeToRefs(shoppingListsStore)

const items = computed(() =>
    currentShoppingList ? currentShoppingList.value.items : []
)
const recipes = computed(() =>
    currentShoppingList.value ? currentShoppingList.value.recipes : []
)

const itemsToDisplay = computed(() => {
    if (items.value) {
        let list = [...items.value]
        if (props.lastSort === "category") {
            list = list.sort((a, b) =>
                props.dir === "asc"
                    ? a.category.localeCompare(b.category)
                    : b.category.localeCompare(a.category)
            )
        } else if (props.lastSort === "name") {
            list = list.sort((a, b) =>
                props.nameDir === "asc"
                    ? a.name.localeCompare(b.name)
                    : b.name.localeCompare(a.name)
            )
        }
        return list
    }
    return []
})

const notBoughtItems = computed(() =>
    itemsToDisplay.value.filter((item) => !item.checked)
)

const boughtItems = computed(() =>
    itemsToDisplay.value.filter((item) => item.checked)
)

const notBoughtRecipes = computed(() =>
    recipes.value.filter((recipe) =>
        recipe.ingredients.every((i) => !i.checked)
    )
)

const boughtRecipes = computed(() =>
    recipes.value.filter((recipe) => recipe.ingredients.every((i) => i.checked))
)
</script>

<template>
    <UiList v-if="notBoughtItems.length || notBoughtRecipes.length">
        <ShoppingListItem
            v-for="item in notBoughtItems"
            :key="item"
            :item="item"
        />
        <ShoppingListRecipe
            v-for="recipe in notBoughtRecipes"
            :key="recipe.id"
            :recipe="recipe"
            :recipes="recipes"
        />
    </UiList>
    <div v-if="boughtItems.length || boughtRecipes.length">
        <UiDividerWithText>Kupione</UiDividerWithText>
        <ion-list :inset="true" class="overflow-auto py-2">
            <ShoppingListItem
                v-for="item in boughtItems"
                :key="item"
                :item="item"
            />
            <ShoppingListRecipe
                v-for="recipe in boughtRecipes"
                :key="recipe.id"
                :recipe="recipe"
                :recipes="recipes"
            />
        </ion-list>
    </div>
</template>

<style lang="scss" scoped>
ion-list {
    margin-left: 0 !important;
    margin-right: 0 !important;
    background-color: white !important;
}
.list-inset {
    border-radius: 1rem !important;
}
</style>
