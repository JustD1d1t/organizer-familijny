<script setup>
const { setDocument } = useFirebase()
const { registerUser } = useFirebaseAuth()

const email = ref("")
const password = ref("")
const nickname = ref("")
const toastMessage = ref("")
const isOpen = ref(false)

const handleError = (errorMessage) => {
    if (errorMessage === "auth/email-already-in-use") {
        toastMessage.value = "Adres e-mail jest używany"
    }
    isOpen.value = true
    setTimeout(() => {
        isOpen.value = false
    }, 2000)
}

const register = async () => {
    try {
        const user = await registerUser(
            email.value,
            password.value,
            nickname.value,
            handleError
        )
        const uid = user.uid
        await setDocument(["users", uid], {
            email: email.value.toLowerCase(),
            uid,
            nickname: nickname.value,
        })
    } catch (error) {
        console.log(error)
    }
}
</script>
<template>
    <ion-page>
        <ion-header>
            <ion-toolbar class="ion-color-primary ion-color">
                <ion-title>Rejestracja</ion-title>
            </ion-toolbar>
        </ion-header>

        <ion-content :fullscreen="true">
            <div class="flex items-center h-full w-full">
                <uiCard class="p-8 w-full">
                    <template v-slot:title> Rejestracja </template>
                    <ion-list lines="none">
                        <ion-item class="">
                            <ion-input
                                class="w-full"
                                label="Email"
                                label-placement="floating"
                                type="email"
                                v-model="email"
                            ></ion-input>
                        </ion-item>
                        <ion-item>
                            <ion-input
                                class="w-full"
                                label="Hasło"
                                label-placement="floating"
                                type="password"
                                v-model="password"
                            ></ion-input>
                        </ion-item>
                        <ion-item>
                            <ion-input
                                class="w-full"
                                label="Nazwa"
                                label-placement="floating"
                                type="text"
                                v-model="nickname"
                            ></ion-input>
                        </ion-item>
                    </ion-list>
                    <uiButton
                        class="w-full mt-4"
                        expand="block"
                        @click="register"
                        >Zarejestruj</uiButton
                    >
                    <uiButton
                        class="w-full mt-4"
                        expand="block"
                        fill="outline"
                        router-link="/login"
                        >Logowanie</uiButton
                    >
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
