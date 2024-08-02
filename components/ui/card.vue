<script setup></script>

<template>
    <ion-card>
        <template v-if="$slots.title || $slots.subtitle">
            <ion-card-header>
                <ion-card-title>
                    <slot name="title"></slot>
                </ion-card-title>
                <ion-card-subtitle>
                    <slot name="subtitle"></slot>
                </ion-card-subtitle>
            </ion-card-header>
        </template>
        <ion-card-content>
            <slot></slot>
        </ion-card-content>
    </ion-card>
</template>

<style scoped lang="scss">
ion-card-content {
    padding: 0;
}
ion-card-header {
    padding-left: 0;
    padding-right: 0;
}
</style>
