<script setup>
const props = defineProps({
    ingredients: {
        type: Array,
        required: true,
        default: () => [],
    },
})
</script>
<template>
    <div class="flex flex-col">
        <UiListItem v-for="ingredient in ingredients" :key="ingredient.id">
            <template #start>
                {{ ingredient.name }}
            </template>
        </UiListItem>
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
