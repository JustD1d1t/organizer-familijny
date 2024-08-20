<script setup>
const props = defineProps(["quantity", "category"])
const { shoppingItems } = useShoppingItems()

const emit = defineEmits(["increaseQuantity", "decreaseQuantity"])

const imageToDisplay = computed(() => {
    const searchedCategory = shoppingItems.find(
        (item) => item.category === props.category
    )
    return searchedCategory ? searchedCategory.icon : ""
})

const increaseQuantity = () => {
    emit("increaseQuantity")
}
const decreaseQuantity = () => {
    emit("decreaseQuantity")
}
</script>
<template>
    <ion-item class="flex items-center">
        <slot name="label" />
        <div v-if="imageToDisplay">
            <img
                :src="imageToDisplay"
                alt="category image"
                class="w-8 h-8 mr-2"
            />
        </div>
        <div class="flex">
            <ion-button
                @click="() => decreaseQuantity()"
                size="small"
                class="my-0"
                fill="clear"
            >
                <ion-icon :icon="ioniconsRemoveOutline"></ion-icon>
            </ion-button>
            <span class="my-auto quantity w-5 text-center">{{ quantity }}</span>
            <ion-button
                @click="() => increaseQuantity()"
                size="small"
                class="my-0"
                fill="clear"
            >
                <ion-icon :icon="ioniconsAdd"></ion-icon>
            </ion-button>
            <slot name="actions" />
        </div>
    </ion-item>
</template>
