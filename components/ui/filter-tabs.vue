<script setup>
const props = defineProps({
    filters: {
        type: Array,
        default: () => [],
    },
    active: {
        type: String,
        default: "Wszystkie",
    },
})
const emit = defineEmits(["click"])
</script>
<template>
    <div class="flex justify-between w-full px-6 mb-4">
        <UiFilterTab
            v-for="filter in filters"
            :key="filter"
            :filter="filter"
            :active="active"
            @click="emit('click', filter)"
        />
    </div>
</template>
