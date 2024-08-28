<script setup>
const props = defineProps({
    label: {
        type: String,
        default: "",
    },
    active: {
        type: Boolean,
        default: false,
    },
})
</script>
<template>
    <ion-item>
        <ion-label>{{ label }}</ion-label>
        <ion-icon
            v-if="active"
            slot="end"
            :icon="ioniconsCheckmarkOutline"
        ></ion-icon>
    </ion-item>
</template>
