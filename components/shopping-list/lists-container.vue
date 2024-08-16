<script setup>
const props = defineProps({
    title: {
        type: String,
        default: () => {},
    },
    shoppingLists: {
        type: Object,
        default: () => {},
    },
})
</script>
<template>
    <div class="w-full" v-if="shoppingLists.length">
        <h2 class="col-span-2 text-center" v-if="title">
            {{ title }}
        </h2>
        <ShoppingListItems :shoppingLists="shoppingLists" />
    </div>
</template>
