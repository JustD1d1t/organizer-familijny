<script setup>
const slots = useSlots()
const hasEndSlotContent = computed(() => {
    return slots.end !== undefined
})
</script>
<template>
    <ion-item class="border-0 grow flex items-start justify-between my-1">
        <span :class="{ 'w-10/12': hasEndSlotContent }">
            <slot name="start" />
        </span>
        <span v-if="hasEndSlotContent">
            <slot name="end" />
        </span>
    </ion-item>
</template>
