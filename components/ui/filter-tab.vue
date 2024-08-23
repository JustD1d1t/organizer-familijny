<script setup>
const props = defineProps({
    filter: {
        type: Object,
        required: true,
    },
    active: {
        type: String,
        required: true,
    },
})
const emit = defineEmits(["click"])
</script>
<template>
    <ion-button
        @click="emit('click', filter)"
        class="text-xl"
        size="small"
        fill="clear"
        :class="{ active: active === filter.value }"
    >
        {{ filter.label }}
    </ion-button>
</template>

<style lang="scss" scoped>
.active {
    border-bottom: 2px solid black;
}
ion-button {
    text-transform: inherit;
}
</style>
