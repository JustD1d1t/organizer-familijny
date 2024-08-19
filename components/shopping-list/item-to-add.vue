<script setup>
const props = defineProps({
    shoppingItem: {
        type: String,
        required: true,
        default: "",
    },
    active: {
        type: Boolean,
        required: false,
        default: false,
    },
})
</script>
<template>
    <ion-card class="m-2 p-8 text-center" :class="[props.active ? 'active' : '']">
        {{ shoppingItem }}
    </ion-card>
</template>

<style scoped>
.active {
    background: var(--ion-color-secondary);
}
</style>
