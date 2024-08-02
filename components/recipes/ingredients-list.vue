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
    <ion-list lines="none">
        <UiListItem v-for="ingredient in ingredients" :key="ingredient.id">
            <template #start>
                {{ ingredient.name }}
            </template>
            <template #end v-if="ingredient.quantity">
                <span>{{ ingredient.quantity }}</span>
            </template>
        </UiListItem>
    </ion-list>
</template>
