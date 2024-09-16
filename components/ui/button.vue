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
    <ion-button
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
    </ion-button>
</template>
<style scoped lang="scss">
@import "@/assets/scss/variables.scss";

.button-primary {
    &::part(native) {
        background-color: $primary-color;
        color: $white;
    }
    &.danger-color {
        &::part(native) {
            background-color: $red !important;
        }
    }
    &.alert-color {
        &::part(native) {
            background-color: $yellow !important;
        }
    }
    &.green-color {
        &::part(native) {
            background-color: $green !important;
        }
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
        background-color: transparent;
        color: $primary-color;
    }
    &.danger-color {
        &::part(native) {
            color: $red !important;
        }
    }
    &.alert-color {
        &::part(native) {
            color: $yellow !important;
        }
    }
    &.green-color {
        &::part(native) {
            color: $green !important;
        }
    }
}
</style>
