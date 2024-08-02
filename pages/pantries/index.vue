<script setup>
const goToAddPantryPage = () => {
    navigateTo("/pantries/new")
}
</script>
<template>
    <ion-page>
        <ion-header>
            <ion-toolbar class="ion-color-primary ion-color">
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
