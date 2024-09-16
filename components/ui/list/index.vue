<script setup>
const props = defineProps({
    lines: {
        type: String,
        default: "none",
    },
})
</script>
<template>
    <ion-list class="overflow-auto py-2 rounded-xl" :inset="true" :lines=props.lines>
        <slot></slot>
    </ion-list>
</template>
