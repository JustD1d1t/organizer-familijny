<script setup>
const props = defineProps(["quantity"])

const emit = defineEmits(["increaseQuantity", "decreaseQuantity"])

const increaseQuantity = () => {
    emit("increaseQuantity")
}
const decreaseQuantity = () => {
    emit("decreaseQuantity")
}
</script>
<template>
    <ion-item class="border-0 grow flex items-center">
        <slot name="label" />
        <div class="flex">
            <uiButton
                @click="() => decreaseQuantity()"
                size="small"
                class="my-0"
            >
                <ion-icon :icon="ioniconsRemoveOutline"></ion-icon>
            </uiButton>
            <span class="my-auto mx-2 quantity">{{ quantity }}</span>
            <uiButton
                @click="() => increaseQuantity()"
                size="small"
                class="my-0"
            >
                <ion-icon :icon="ioniconsAdd"></ion-icon>
            </uiButton>
        </div>
    </ion-item>
</template>
