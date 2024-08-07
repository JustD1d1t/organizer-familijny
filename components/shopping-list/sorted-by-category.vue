<script setup>
import { useRoute } from "vue-router"
import { useShoppingListsStore } from "~/stores/shopping-lists"
const shoppingListsStore = useShoppingListsStore()
const { handleItemChange, removeItem } = shoppingListsStore
const { currentShoppingList } = storeToRefs(shoppingListsStore)

const items = computed(() =>
    currentShoppingList.value ? currentShoppingList.value.items : []
)
const recipes = computed(() =>
    currentShoppingList.value ? currentShoppingList.value.recipes : []
)

const availableCategories = computed(() => {
    const categories = currentShoppingList.value.items.map(
        (item) => item.category
    )
    return [...new Set(categories)]
})
</script>
<template>
    <ion-accordion-group>
        <ion-accordion
            v-for="category in availableCategories"
            :key="category"
            :value="category"
        >
            <ion-item slot="header" color="light">
                <ion-label>{{ category }}</ion-label>
            </ion-item>
            <div class="ion-padding" slot="content">
                <ion-list lines="none" class="overflow-auto h-full">
                    <ShoppingListItem
                        v-for="item in items.filter(
                            (item) => item.category === category
                        )"
                        :key="item"
                        :item="item"
                        @remove-item="() => removeItem(item)"
                        @handleItemChange="() => handleItemChange(item)"
                    />
                </ion-list>
            </div>
        </ion-accordion>
    </ion-accordion-group>
    <ion-list lines="none" class="overflow-auto h-full">
        <ShoppingListRecipe
            v-for="recipe in recipes"
            :key="recipe.id"
            :recipe="recipe"
            :recipes="recipes"
        />
    </ion-list>
</template>
