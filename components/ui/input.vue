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
    labelPlacement: {
        type: String,
        default: "floating",
    },
    type: {
        type: String,
        default: "text",
    },
    error: {
        type: String,
        default: "",
    },
    placeholder: {
        type: String,
        default: "",
    },
})
const inputValue = ref(props.modelValue)

watch(inputValue, (newValue) => {
    emit("update:modelValue", newValue)
})
</script>
<template>
    <ion-item class="flex flex-col relative" :class="{ 'mb-3': error }">
        <ion-input
            class="w-full pb-16"
            :class="classes"
            :label="label"
            :label-placement="labelPlacement"
            :type="type"
            v-model="inputValue"
            :placeholder="placeholder"
        ></ion-input>
        <span class="absolute top-[100%] text-sm font-bold" v-if="error">
            {{ error }}
        </span>
    </ion-item>
</template>
<style lang="scss" scoped>
ion-item {
    overflow: visible;
}
span {
    color: var(--ion-color-danger);
}
</style>
