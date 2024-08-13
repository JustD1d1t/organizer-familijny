<script setup>
const props = defineProps({
    src: String,
    alt: String,
})
</script>
<template>
    <div class="flex flex-col items-center bg-white shadow-xl rounded-xl py-4">
        <img :src="props.src" :alt="props.alt" class="w-24 object-contain" />
        <span class="text-lg font-bold mt-1 text-center">
            <slot></slot>
        </span>
    </div>
</template>
