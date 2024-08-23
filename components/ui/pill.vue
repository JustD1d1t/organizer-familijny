<script setup>
const props = defineProps({
    active: {
        type: Boolean,
        default: false,
    },
})
</script>
<template>
    <div
        class="px-4 py-2 border-2 text-gray-800 rounded-full text-xs flex items-center whitespace-nowrap"
        :class="{ 'border-sky-500': active }"
    >
        <slot></slot>
    </div>
</template>
