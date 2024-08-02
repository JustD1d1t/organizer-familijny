<script setup>
import { useRoute } from "vue-router"

const route = useRoute()
const props = defineProps({
    item: {
        type: Object,
        default: () => {},
    },
})
import { useShoppingListsStore } from "~/stores/shopping-lists"
const shoppingListsStore = useShoppingListsStore()
const { handleItemChange, removeItem } = shoppingListsStore
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
        </template>
    </UiListCheckboxItem>
</template>
