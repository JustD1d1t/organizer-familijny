<script setup lang="ts">
const props = defineProps({
    name: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    price: {
        type: [Number, String],
        required: true,
    },
})

const emits = defineEmits(["buttonClick", "removeClick"])
</script>
<template>
    <ion-item
        class="flex justify-between pl-6 pr-2 bg-white rounded-2xl shadow-lg"
    >
        <div class="flex flex-col w-full">
            <ion-label class="text-lg font-semibold">{{ name }}</ion-label>
            <ion-label class="text-sm text-gray-500">{{ category }}</ion-label>
        </div>
        <ion-label class="text-lg font-semibold">{{ price }} PLN</ion-label>
        <uiButton type="tertiary" @click="emits('buttonClick')">
            <ion-icon slot="icon-only" :icon="ioniconsArrowForward"></ion-icon>
        </uiButton>
        <uiButton type="tertiary" @click="emits('removeClick')">
            <ion-icon slot="icon-only" :icon="ioniconsTrash"></ion-icon>
        </uiButton>
    </ion-item>
</template>
