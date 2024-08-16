<script setup>
const { shoppingItems } = useShoppingItems()
const props = defineProps({
    item: {
        type: Object,
        default: () => {},
    },
})
import { useShoppingListsStore } from "~/stores/shopping-lists"
const shoppingListsStore = useShoppingListsStore()
const { removeItem, handleItemChange } = shoppingListsStore

const imageToDisplay = computed(() => {
    const searchedCategory = shoppingItems.find(
        (item) => item.category === props.item.category
    )
    return searchedCategory ? searchedCategory.icon : ""
})
</script>
<template>
    <UiListCheckboxItem
        :item="props.item"
        :handle-item-change="() => handleItemChange(props.item)"
        :removeItem="() => removeItem(item)"
    >
        <template #label>
            <div class="flex flex-col grow ml-4">
                <span class="text-base">{{ item.name }} </span>
                <span class="text-xs"> {{ item.category }}</span>
            </div>
            <div v-if="imageToDisplay">
                <img
                    :src="imageToDisplay"
                    alt="category image"
                    class="w-8 h-8 mr-2"
                />
            </div>
        </template>
    </UiListCheckboxItem>
</template>
