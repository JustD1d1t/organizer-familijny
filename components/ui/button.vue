<script setup>
const props = defineProps({
    type: {
        type: String,
        default: "primary",
        validator: (value) => ["primary", "secondary"].includes(value),
    },
    fill: {
        type: String,
        default: "solid",
        validator: (value) => ["solid", "outline", "clear"].includes(value),
    },
})

const buttonClass = computed(() => {
    return {
        "button-primary": props.type === "primary",
        "button-secondary": props.type === "secondary",
    }
})
</script>
<template>
    <ion-button :class="buttonClass" :fill="props.fill">
        <slot />
    </ion-button>
</template>