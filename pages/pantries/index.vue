<script setup>
const goToAddPantryPage = () => {
    navigateTo("/pantries/new")
}
</script>
<template>
    <ion-page>
        <ion-header style="background: var(--ion-color-light);">
            <ion-toolbar >
                <ion-buttons slot="start">
                    <ion-back-button
                        text=""
                        :icon="ioniconsArrowBackOutline"
                    ></ion-back-button>
                </ion-buttons>
                <ion-title>Spiżarnia</ion-title>
            </ion-toolbar>
        </ion-header>

        <ion-content :fullscreen="true">
            <PantryLists />
            <ion-fab slot="fixed" vertical="bottom" horizontal="end">
                <ion-fab-button @click="goToAddPantryPage">
                    <ion-icon :icon="ioniconsAdd"></ion-icon>
                </ion-fab-button>
            </ion-fab>
        </ion-content>
    </ion-page>
</template>
