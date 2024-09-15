<template>
    <ion-header style="background: var(--ion-color-light);">
        <ion-toolbar>
            <ion-title>Cześć, {{ nickname }}</ion-title>
            <ion-buttons slot="end">
                <ion-button fill="clear" @click="openPersonMenu">
                    <ion-icon slot="icon-only" :icon="ioniconsPerson" />
                </ion-button>
            </ion-buttons>
        </ion-toolbar>
    </ion-header>
</template>

<style lang="scss" scoped>
ion-toolbar {
    --background: var(--ion-color-light);
    --color: --ion-color-primary-contrast;
}
</style>
