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
    link: {
        type: String,
        default: "",
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
    <ion-button :class="buttonClass" :fill="props.fill" :router-link="link">
        <slot />
    </ion-button>
</template>
