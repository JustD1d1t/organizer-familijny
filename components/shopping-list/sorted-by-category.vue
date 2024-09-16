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

const availableCategoriesWithProducts = computed(() => {
    const obj = {}
    currentShoppingList.value.items.forEach((item) => {
        if (!obj[item.category]) {
            obj[item.category] = { checked: [], unchecked: [] }
        }
        if (item.checked) {
            obj[item.category].checked.push(item)
        } else {
            obj[item.category].unchecked.push(item)
        }
    })
    return obj
})
</script>
<template>
    <ion-accordion-group>
        <ion-accordion
            v-for="(items, key) in availableCategoriesWithProducts"
            :key="key"
            :value="items"
        >
            <ion-item slot="header" color="light">
                <ion-label>{{ key }}</ion-label>
            </ion-item>
            <div class="ion-padding" slot="content">
                <ion-list :inset="true" class="overflow-auto">
                    <ShoppingListItem
                        v-for="item in items.unchecked"
                        :key="item"
                        :item="item"
                        @remove-item="() => removeItem(item)"
                        @handleItemChange="() => handleItemChange(item)"
                    />
                </ion-list>
                <div v-if="items.checked.length">
                    <UiDividerWithText>Kupione</UiDividerWithText>
                    <ion-list :inset="true" class="overflow-auto">
                        <ShoppingListItem
                            v-for="item in items.checked"
                            :key="item"
                            :item="item"
                            @remove-item="() => removeItem(item)"
                            @handleItemChange="() => handleItemChange(item)"
                        />
                    </ion-list>
                </div>
            </div>
        </ion-accordion>
    </ion-accordion-group>
    <ion-list :inset="true" class="overflow-auto">
        <ShoppingListRecipe
            v-for="recipe in recipes"
            :key="recipe.id"
            :recipe="recipe"
            :recipes="recipes"
        />
    </ion-list>
</template>
