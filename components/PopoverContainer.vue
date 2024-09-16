<script setup>
const props = defineProps({
    sortId: {
        type: String,
        default: "",
        required: true,
    },
    width: {
        type: String,
        default: "350px",
    },
})
</script>
<template>
    <uiButton :id="sortId" type="tertiary">
        <ion-icon slot="icon-only" :icon="ioniconsEllipsisVerticalOutline" />
    </uiButton>
    <ion-popover
        :trigger="sortId"
        trigger-action="click"
        :style="{ '--width': width }"
    >
        <ion-content class="ion-padding">
            <ion-list lines="none">
                <slot />
            </ion-list>
        </ion-content>
    </ion-popover>
</template>
