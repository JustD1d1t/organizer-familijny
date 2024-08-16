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
            @ionChange="() => props.handleItemChange(props.item)"
            :checked="props.item.checked"
        ></ion-checkbox>
        <slot name="label" />
        <ion-button
            slot="end"
            @click="() => props.removeItem(props.item)"
            size="small"
            fill="clear"
        >
            <ion-icon :icon="ioniconsTrash"></ion-icon>
        </ion-button>
    </ion-item>
</template>
