<script setup>
const props = defineProps({
    list: {
        type: Object,
        required: true,
        default: () => ({}),
    },
})
</script>
<template>
    <ion-text>
        <p>{{ list.name }}</p>
    </ion-text>
</template>
