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
            <uiButton
                @click="emit('cancelShoppingModal')"
                color="danger"
                data-test="cancel-button"
                >Nie</uiButton
            >
            <uiButton
                @click="emit('confirmShoppingModal')"
                color="success"
                data-test="submit-button"
                >Tak</uiButton
            >
        </div>
    </div>
</template>
