<script setup>
const props = defineProps({
    type: {
        type: String,
        default: "primary",
        validator: (value) =>
            ["primary", "secondary", "tertiary"].includes(value),
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
    color: {
        type: String,
        default: undefined,
        validator: (value) => ["danger", "alert", "success"].includes(value),
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
    <button
        :class="{
            [buttonClass]: true,
            'danger-color': props.color === 'danger',
            'alert-color': props.color === 'alert',
            'green-color': props.color === 'success',
        }"
        :fill="props.fill"
        :router-link="link"
    >
        <slot />
    </button>
</template>
<style scoped lang="scss">
button {
    color: blue;
    padding: 0.25rem 0.5rem;
}
@import "@/assets/scss/variables.scss";
.button-primary {
    background-color: $primary-color;
    color: $white;
    &.danger-color {
        background-color: $red !important;
    }
    &.alert-color {
        background-color: $yellow !important;
    }
    &.green-color {
        background-color: $green !important;
    }
}

.button-secondary {
    background-color: $white;
    color: $primary-color;
    border: 2px solid $primary-color;
}
.button-tertiary {
    &.ion-activated {
        --background-activated: transparent !important;
    }
    background-color: transparent;
    color: $primary-color;
    box-shadow: unset;
    &.danger-color {
        color: $red !important;
    }
    &.alert-color {
        color: $yellow !important;
    }
    &.green-color {
        color: $green !important;
    }
}
</style>
