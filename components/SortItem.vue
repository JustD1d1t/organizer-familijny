<script setup>
const props = defineProps({
    label: {
        type: String,
        default: "",
    },
    type: {
        type: String,
        default: "",
    },
    dir: {
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
        <div v-if="type === 'name'">
            <img
                class="w-6 mr-2"
                src="@/assets/svg/ascending-letters.svg"
                v-if="active && dir === 'asc'"
            />
            <img
                class="w-6 mr-2"
                src="@/assets/svg/descending-letters.svg"
                v-if="active && dir === 'desc'"
            />
        </div>
        <div v-else-if="type === 'amount'">
            <img
                class="w-6 mr-2"
                src="@/assets/svg/ascending.svg"
                v-if="active && dir === 'asc'"
            />
            <img
                class="w-6 mr-2"
                src="@/assets/svg/descending.svg"
                v-if="active && dir === 'desc'"
            />
        </div>
    </ion-item>
</template>
