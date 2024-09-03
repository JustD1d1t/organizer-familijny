<script setup>
// const { resetPassword } = useFirebaseAuth()

import { Toast } from "@capacitor/toast"
const { displayToast } = useAlerts()
const userStore = useUserStore()
const { resetPassword } = userStore

const toastMessage = ref("")
const isOpen = ref(false)
const email = ref("")

const openPersonMenu = async () => {
    await menuController.open("person")
}

const sendPasswordResetRequest = async () => {
    try {
        const data = await resetPassword(email.value)
        if (data.error) {
            displayToast(data.error.message)
            return;
        }
        displayToast(data.message)
    } catch (error) {
        displayToast(error)
    }
}
</script>
<template>
    <ion-page>
        <ion-header>
            <ion-toolbar>
                <ion-title>Zresetuj hasło</ion-title>
                <ion-buttons slot="end">
                    <ion-button fill="clear" @click="openPersonMenu">
                        <ion-icon slot="icon-only" :icon="ioniconsPerson" />
                    </ion-button>
                </ion-buttons>
            </ion-toolbar>
        </ion-header>
        <ion-content :fullscreen="true">
            <div class="flex justify-center items-center h-full w-full">
                <uiCard class="p-8 w-full">
                    <template v-slot:title>Zresetuj hasło</template>
                    <ion-list lines="none">
                        <ion-item class="mb-4">
                            <ion-input
                                class="w-full"
                                label="Email"
                                label-placement="floating"
                                type="email"
                                v-model="email"
                            ></ion-input>
                        </ion-item>
                    </ion-list>
                    <ion-button
                        class="w-full mt-4"
                        expand="block"
                        @click="sendPasswordResetRequest"
                    >
                        Resetuj hasło
                    </ion-button>
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
