<script setup>
// const { resetPassword } = useFirebaseAuth()

import { Toast } from "@capacitor/toast"
const { displayToast } = useAlerts()
const userStore = useUserStore()
const { resetPassword } = userStore

const toastMessage = ref("")
const isOpen = ref(false)
const email = ref("")
const emailInputError = ref("")

const openPersonMenu = async () => {
    await menuController.open("person")
}

const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(String(email).toLowerCase())
}

const sendPasswordResetRequest = async () => {
    emailInputError.value = ""

    // Validate email
    if (!email.value) {
        emailInputError.value = "Email jest wymagany."
    }
    if (!validateEmail(email.value)) {
        emailInputError.value = "Nieprawidłowy format email."
    }

    if (emailInputError.value) {
        return
    }
    try {
        const data = await resetPassword(email.value)
        if (data.error) {
            displayToast(data.error.message)
            return
        }
        displayToast(data.message)
    } catch (error) {
        displayToast(error)
    }
}
</script>
<template>
    <ion-page>
        <ion-header style="background: var(--ion-color-light);">
            <ion-toolbar>
                <ion-buttons slot="start">
                    <ion-back-button
                        text=""
                        :icon="ioniconsArrowBackOutline"
                    ></ion-back-button>
                </ion-buttons>
                <ion-title>Zresetuj hasło</ion-title>
            </ion-toolbar>
        </ion-header>
        <ion-content :fullscreen="true">
            <div class="flex justify-center items-center h-full w-full">
                <uiCard class="p-8 w-full">
                    <template v-slot:title>Zresetuj hasło</template>
                    <ion-list lines="none" class="pb-4">
                        <UiInput
                            label="Email"
                            type="email"
                            v-model="email"
                            :error="emailInputError"
                        />
                    </ion-list>
                    <uiButton
                        class="w-full mt-4"
                        expand="block"
                        @click="sendPasswordResetRequest"
                    >
                        Resetuj hasło
                    </uiButton>
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
