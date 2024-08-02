<script setup>
const { sendVeritifactionEmail } = useFirebaseAuth()

const toastMessage = ref("")
const isOpen = ref(false)

const openPersonMenu = async () => {
    await menuController.open("person")
}
const sendEmail = () => {
    sendVeritifactionEmail()
}

const confirmResendToast = () => {
    toastMessage.value = "Email weryfikacyjny wysłany ponownie"
    isOpen.value = true
    setTimeout(() => {
        isOpen.value = false
    }, 2000)
}

const errorResendToast = () => {
    toastMessage.value = "Błąd przy wysyłaniu emaila weryfikacyjnego"
    isOpen.value = true
    setTimeout(() => {
        isOpen.value = false
    }, 2000)
}
</script>
<template>
    <ion-page>
        <ion-header>
            <ion-toolbar class="ion-color-primary ion-color">
                <ion-title>Email niezweryfikowany</ion-title>
                <ion-buttons slot="end">
                    <uiButton fill="clear" @click="openPersonMenu">
                        <ion-icon slot="icon-only" :icon="ioniconsPerson" />
                    </uiButton>
                </ion-buttons>
            </ion-toolbar>
        </ion-header>
        <ion-content :fullscreen="true">
            <div class="flex justify-center items-center h-full w-full">
                <uiCard class="parent flex justify-center items-center">
                    <div>Zweryfikuj emaila</div>
                    <div>Nie otrzymałeś/aś maila?</div>
                    <div class="flex">
                        <uiButton class="w-full" @click="sendEmail">Wyslij ponownie</uiButton>
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
