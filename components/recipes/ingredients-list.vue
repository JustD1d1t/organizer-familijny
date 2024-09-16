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
    <uiList :inset="true" :lines="true" class="p-2" :bg-white="true">
        <UiListItem v-for="ingredient in ingredients" :key="ingredient.id">
            <template #start>
                {{ ingredient.name }}
            </template>
        </UiListItem>
    </uiList>
</template>

<style lang="scss" scoped>
.list-inset {
    border-radius: 1rem !important;
}
</style>
