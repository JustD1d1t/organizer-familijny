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
    <uiButton
        @click="emit('click', filter)"
        class="text-xl"
        size="small"
        type="tertiary"
        :class="{ active: active === filter.value }"
    >
        {{ filter.label }}
    </uiButton>
</template>

<style lang="scss" scoped>
@import "@/assets/scss/variables.scss";
.active {
    border-bottom: 2px solid $primary-color;
}
ion-button {
    text-transform: inherit;
}
</style>
