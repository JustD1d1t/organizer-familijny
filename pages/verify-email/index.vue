<script setup>
// const { sendVeritifactionEmail } = useFirebaseAuth()

const toastMessage = ref("")
const isOpen = ref(false)

const openPersonMenu = async () => {
    await menuController.open("person")
}
// const sendEmail = () => {
//     sendVeritifactionEmail()
// }
</script>
<template>
    <ion-page>
        <ion-header>
            <ion-toolbar >
                <ion-title>Email niezweryfikowany</ion-title>
                <ion-buttons slot="end">
                    <ion-button fill="clear" @click="openPersonMenu">
                        <ion-icon slot="icon-only" :icon="ioniconsPerson" />
                    </ion-button>
                </ion-buttons>
            </ion-toolbar>
        </ion-header>
        <ion-content :fullscreen="true">
            <div class="flex justify-center items-center h-full w-full">
                <uiCard class="parent flex justify-center items-center">
                    <div>Zweryfikuj emaila</div>
                    <div>Nie otrzymałeś/aś maila?</div>
                    <div class="flex">
                        <ion-button class="w-full">Wyslij ponownie</ion-button>
                    </div>
                </uiCard>
            </div>
            <ion-toast
                :is-open="isOpen"
                :message="toastMessage"
                :duration="2000"
            ></ion-toast>
        </ion-content>
    </ion-page>
</template>
<style lang="scss" scoped>
.parent {
    flex-direction: column;
    gap: 36px;
    margin: auto;
    padding: 24px;

    div:first-child {
        font-size: 36px;
        color: blueviolet;
    }
}
</style>
