<template>
    <ion-list class="overflow-auto py-2 rounded-xl" :inset="true">
        <slot></slot>
    </ion-list>
</template>
<style lang="scss" scoped>
ion-list.list-inset {
    overflow: auto !important;
}
</style>
