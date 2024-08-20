<script setup>
const { backendUrl } = useConfig()

const userStore = useUserStore()
const { registerUser } = userStore

const email = ref("")
const password = ref("")
const nickname = ref("")
const toastMessage = ref("")
const isOpen = ref(false)

const register = async () => {
    try {
        const user = await registerUser(
            email.value,
            password.value,
            nickname.value
        )
        const uid = user.localId
        await fetch(`${backendUrl}/users/add-user`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                user: {
                    uid,
                    email: email.value.toLowerCase(),
                },
            }),
        })
        navigateTo("/login")
    } catch (error) {
        console.log(error)
    }
}
</script>
<template>
    <ion-page>
        <ion-header>
            <ion-toolbar >
                <ion-title>Rejestracja</ion-title>
            </ion-toolbar>
        </ion-header>

        <ion-content :fullscreen="true">
            <div class="flex items-center h-full w-full">
                <uiCard class="p-8 w-full">
                    <template v-slot:title> Rejestracja </template>
                    <ion-list>
                        <uiInput
                            class="w-full"
                            label="Email"
                            type="email"
                            v-model="email"
                        ></uiInput>
                        <uiInput
                            class="w-full"
                            label="Hasło"
                            type="password"
                            v-model="password"
                        ></uiInput>
                        <uiInput
                            class="w-full"
                            label="Nazwa"
                            type="text"
                            v-model="nickname"
                        ></uiInput>
                    </ion-list>
                    <ion-button
                        class="w-full mt-4"
                        expand="block"
                        @click="register"
                        >Zarejestruj</ion-button
                    >
                    <ion-button
                        class="w-full mt-4"
                        expand="block"
                        fill="outline"
                        router-link="/login"
                        >Logowanie</ion-button
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
