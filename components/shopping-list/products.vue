<script setup>
import { useRoute } from "vue-router"
const shoppingListsStore = useShoppingListsStore()

const route = useRoute()
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
</script>

<template>
    <ion-list lines="none" class="overflow-auto h-full">
        <ShoppingListItem
            v-for="item in itemsToDisplay"
            :key="item"
            :item="item"
        />
        <ShoppingListRecipe
            v-for="recipe in recipes"
            :key="recipe.id"
            :recipe="recipe"
            :recipes="recipes"
        />
    </ion-list>
</template>
