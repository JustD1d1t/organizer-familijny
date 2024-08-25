<script setup>
const router = useRouter()
const goToAddNewShoppingList = () => {
    router.push("/shopping-lists/new")
}

const shoppingListsStore = useShoppingListsStore()
const { getAllShoppingLists } = shoppingListsStore

useAsyncData(async () => {
    await getAllShoppingLists()
})
</script>
<template>
    <ion-page>
        <ion-header :translucent="true">
            <ion-toolbar>
                <ion-buttons slot="start">
                    <ion-back-button
                        text=""
                        :icon="ioniconsArrowBackOutline"
                    ></ion-back-button>
                </ion-buttons>
                <ion-title>Listy zakupowe</ion-title>
            </ion-toolbar>
        </ion-header>
        <ion-content :fullscreen="true">
            <ShoppingListLists />
            <ion-fab slot="fixed" vertical="bottom" horizontal="end">
                <ion-fab-button @click="goToAddNewShoppingList">
                    <ion-icon :icon="ioniconsAdd"></ion-icon>
                </ion-fab-button>
            </ion-fab>
        </ion-content>
    </ion-page>
</template>
