<script setup>
const slots = useSlots()
const hasEndSlotContent = computed(() => {
    return slots.end !== undefined
})
</script>
<template>
    <div class="flex flex-col py-2 pl-6 pr-2 my-1 bg-white rounded-2xl shadow-2xl">
        <span :class="{ 'w-10/12': hasEndSlotContent }">
            <slot name="start" />
        </span>
        <span v-if="hasEndSlotContent">
            <slot name="end" />
        </span>
    </div>
</template>
