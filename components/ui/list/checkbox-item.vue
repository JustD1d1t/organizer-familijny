<script setup>
const props = defineProps({
    item: {
        type: Object,
        required: true,
        defualt: () => {},
    },
    removeItem: {
        type: Function,
        required: true,
        default: () => {},
    },
    handleItemChange: {
        type: Function,
        required: true,
        default: () => {},
    },
})
</script>
<template>
    <ion-item>
        <ion-checkbox
            slot="start"
            class="mr-0"
            :aria-label="props.item.name"
            @ionChange="() => props.handleItemChange(props.item)"
            :checked="props.item.checked"
        ></ion-checkbox>
        <slot name="label" />
        <uiButton
            slot="end"
            @click="() => props.removeItem(props.item)"
            size="small"
            type="tertiary"
        >
            <ion-icon :icon="ioniconsTrash"></ion-icon>
        </uiButton>
    </ion-item>
</template>

<style lang="scss" scoped>
ion-button {
    margin-inline-start: 0 !important;
}
</style>
