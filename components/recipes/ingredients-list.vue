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
    <ion-list :inset="true" class="p-2">
        <UiListItem v-for="ingredient in ingredients" :key="ingredient.id">
            <template #start>
                {{ ingredient.name }}
            </template>
        </UiListItem>
    </ion-list>
</template>

<style lang="scss" scoped>
.list-inset {
    border-radius: 1rem !important;
}
</style>
