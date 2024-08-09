<script setup>
const emit = defineEmits(["cancelShoppingModal", "confirmShoppingModal"])
const props = defineProps({
    name: {
        type: String,
        default: () => "",
    },
})
</script>

<template>
    <div class="inner-content">
        <h2>
            Czy dodać <span data-test="test-name">{{ name }}</span> do listy
            zakupowej?
        </h2>
        <div class="w-full flex justify-between flex-wrap">
            <ion-button
                @click="emit('cancelShoppingModal')"
                color="danger"
                data-test="cancel-button"
                >Nie</ion-button
            >
            <ion-button
                @click="emit('confirmShoppingModal')"
                color="success"
                data-test="submit-button"
                >Tak</ion-button
            >
        </div>
    </div>
</template>
