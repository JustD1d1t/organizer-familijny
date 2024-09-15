<script setup>
const props = defineProps({
    title: {
        type: String,
        default: "",
    },
    subtitle: {
        type: String,
        default: "",
    },
    icon: {
        type: String,
        default: "",
    },
})
</script>
<template>
    <div class="info-card p-4">
        <div class="flex justify-between mb-2" v-if="props.title">
            <span class="text-lg font-bold">{{ props.title }}</span>
            <ion-icon :icon="ioniconsBulb"></ion-icon>
        </div>
        <div v-if="props.subtitle">{{ props.subtitle }}</div>
        <slot />
    </div>
</template>
<style lang="scss" scoped>
@import "@/assets/scss/variables.scss";
.info-card {
    border-radius: 16px;
    border: 2px solid $light-gray;
}
::v-deep {
    ul {
        list-style-type: disc;
        padding-left: 20px;
    }
}
</style>
