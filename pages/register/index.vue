<script setup>
const { backendUrl } = useConfig()

const userStore = useUserStore()
const { registerUser } = userStore
const { openToast } = useAlerts()

const email = ref("")
const password = ref("")
const nickname = ref("")

const register = async () => {
    try {
        const user = await registerUser(
            email.value,
            password.value,
            nickname.value
        )
        if (user.error) {
            openToast(user.error, "danger")
            return
        }
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
        openToast("Zarejestrowano pomyślnie")
        navigateTo("/login")
    } catch (error) {
        console.log(error)
    }
}
</script>
<template>
    <ion-page>
        <ion-header>
            <ion-toolbar>
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
        </ion-content>
    </ion-page>
</template>
