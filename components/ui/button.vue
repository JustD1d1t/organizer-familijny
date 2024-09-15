<script setup>
const props = defineProps({
    type: {
        type: String,
        default: "primary",
        validator: (value) =>
            ["primary", "secondary", "outline"].includes(value),
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
    return props.type === "primary"
        ? "button-primary"
        : props.type === "secondary"
        ? "button-secondary"
        : props.type === "tertiary"
        ? "button-tertiary"
        : ""
})
</script>
<template>
    <ion-button :class="buttonClass" :fill="props.fill" :router-link="link">
        <slot />
    </ion-button>
</template>
<style scoped lang="scss">
@import "@/assets/scss/variables.scss";
.button-primary {
    &::part(native) {
        background-color: $primary-color;
        color: $white;
    }
}

.button-secondary {
    &::part(native) {
        background-color: $white;
        color: $primary-color;
        border: 2px solid $primary-color;
    }
}
.button-tertiary {
    &::part(native) {
        background-color: $white;
        color: $primary-color;
    }
}
</style>
