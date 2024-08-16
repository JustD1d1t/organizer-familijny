<script setup>
const props = defineProps({
    shoppingLists: {
        type: Object,
        default: () => {},
    },
})
</script>
<template>
    <div class="flex flex-col">
        <ShoppingListSingleListItem
            v-for="shoppingList in shoppingLists"
            :key="shoppingList.name"
            :shoppingList="shoppingList"
        />
    </div>
</template>
