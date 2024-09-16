<script setup>
const props = defineProps({
    lines: {
        type: Boolean,
        default: false,
    },
    bgWhite: {
        type: Boolean,
        default: false,
    },
    inset: {
        type: Boolean,
        default: false,
    },
})
</script>
<template>
    <ion-list
        class="overflow-auto py-2 rounded-xl"
        :class="{ 'bg-white': props.bgWhite }"
        :inset="props.inset"
        :lines="props.lines ? 'full' : 'none'"
    >
        <slot></slot>
    </ion-list>
</template>
<style lang="scss" scoped>
@import "@/assets/scss/variables.scss";
.bg-white {
    background-color: $white;
}
</style>
