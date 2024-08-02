<script setup>
const emit = defineEmits(["update:modelValue"])
const props = defineProps({
    modelValue: {
        type: [String, Number],
        default: "",
    },
    label: {
        type: String,
        default: "",
    },
    classes: {
        type: String,
        default: "",
    },
    label: {
        type: String,
        default: "",
    },
    labelPlacement: {
        type: String,
        default: "floating",
    },
    type: {
        type: String,
        default: "text",
    },
})

const inputValue = ref(props.modelValue)

watch(inputValue, (newValue) => {
    emit("update:modelValue", newValue)
})
</script>
<template>
    <ion-item class="mb-4">
        <ion-input
            :class="classes"
            :label="label"
            :label-placement="labelPlacement"
            :type="type"
            v-model="inputValue"
        ></ion-input>
    </ion-item>
</template>
