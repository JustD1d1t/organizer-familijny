<script setup>
const slots = useSlots()
const hasEndSlotContent = computed(() => {
    return slots.end !== undefined
})
</script>
<template>
    <ion-item class="flex flex-col">
        <span :class="{ 'w-10/12': hasEndSlotContent }">
            <slot name="start" />
        </span>
        <span v-if="hasEndSlotContent">
            <slot name="end" />
        </span>
    </ion-item>
</template>
