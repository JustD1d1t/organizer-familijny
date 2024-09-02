<script setup>
const toastMessage = ref("")
const isOpen = ref(false)

const userStore = useUserStore()
const { resendVerificationEmail, checkEmailVerification } = userStore

const openPersonMenu = async () => {
    await menuController.open("person")
}
const checkVerification = async () => {
    const { emailVerified } = await checkEmailVerification()
    if (emailVerified) {
        localStorage.setItem("emailVerified", true)
        navigateTo("/")
    }
}
</script>
<template>
    <ion-page>
        <ion-header>
            <ion-toolbar>
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
                    <div class="text-center">Nie otrzymałeś/aś maila?</div>
                    <div class="flex">
                        <ion-button
                            @click="resendVerificationEmail"
                            class="w-full"
                            >Wyślij ponownie</ion-button
                        >
                    </div>
                    <div class="flex">
                        <ion-button @click="checkVerification" class="w-full"
                            >Sprawdź weryfikację</ion-button
                        >
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
