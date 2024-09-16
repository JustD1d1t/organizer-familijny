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
            Czy dodać <span class="h2 font-bold">{{ name }}</span> do listy
            zakupowej?
        </h2>
        <div class="w-full flex justify-between flex-wrap">
            <uiButton
                @click="emit('cancelShoppingModal')"
                color="alert"
                data-test="cancel-button"
            >
                Nie
            </uiButton>
            <uiButton
                @click="emit('confirmShoppingModal')"
                color="success"
                data-test="submit-button"
            >
                Tak
            </uiButton>
        </div>
    </div>
</template>
