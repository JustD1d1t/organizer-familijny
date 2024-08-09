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
    <ion-item class="border-0">
        <ion-checkbox
            slot="start"
            class="mr-0"
            aria-label="Toggle task completion"
            @ionChange="() => props.handleItemChange(props.item)"
            :checked="props.item.checked"
        ></ion-checkbox>
        <slot name="label" />
        <ion-button
            slot="end"
            @click="() => props.removeItem(props.item)"
            size="small"
        >
            <ion-icon :icon="ioniconsTrash"></ion-icon>
        </ion-button>
    </ion-item>
</template>
